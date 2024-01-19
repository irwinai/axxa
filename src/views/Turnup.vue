<script setup lang="ts">
import { ref, reactive, computed, nextTick, watch } from 'vue';
import { ElTable } from 'element-plus';
import moment from 'moment';
const tokenInput = ref<string>('');
const tokenInfo = reactive({
    userInfo: {} as any,
    portfolio: {
        holding: [],
    } as any,
    workerList: [] as any,
});
const isAutoWorking = ref(false);
const commonFetch = async (url: string, data: object = {}) => {
    try {
        const response = await fetch(`https://turnup-uw-test-apiv2.turnup.so/api${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                token: tokenInput.value,
            }),
        });
        const responseData = await response.json();

        if (responseData.code === 0) {
            return responseData.data;
        }
    } catch (error) {
        await relogin();
    }
};

async function getUserInfo() {
    try {
        return await commonFetch('/v1/userinfo');
    } catch (error) {}
}
async function getPortfolio() {
    try {
        return await commonFetch('/v1/portfolio');
    } catch (error) {}
}
async function relogin() {
    try {
        return await commonFetch('/v1/relogin');
    } catch (error) {}
}
const showInfo = ref(false);
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<any>([]);
let timerMain: any = null;
const updateTokenInfo = async () => {
    tokenInfo.userInfo = await getUserInfo();
    tokenInfo.portfolio = await getPortfolio();
};
const main = async () => {
    if (tokenInput.value) {
        clearInterval(timerMain);
        await updateTokenInfo();
        timerMain = setInterval(updateTokenInfo, 10000);
        showInfo.value = true;
    } else {
        clearInterval(timerMain);
        showInfo.value = false;
    }
};
const handleSelectionChange = (val: any) => {
    multipleSelection.value = val.map((item: any) => item.userId);
};
const workerState = computed(() => {
    const holding = tokenInfo.portfolio.holding;
    const userWorkers = holding.filter((worker: any) => worker.managerId === tokenInfo.userInfo.userId);

    const sortedWorkList = userWorkers.sort((a: any, b: any) => b.tierId - a.tierId);
    tokenInfo.workerList = sortedWorkList;

    const workerState = userWorkers.reduce(
        (acc: any, worker: any) => {
            if (worker.workEndTimestamp) {
                acc.working++;
                acc.selfWorkProfit += worker.selfWorkProfit;
            } else {
                acc.paused++;
            }
            return acc;
        },
        { working: 0, paused: 0, count: sortedWorkList.length, selfWorkProfit: 0 }
    );

    return workerState;
});

// 执行批量挖矿
const friendTradeDispatchBatchEmplyees = async (emplyeeIds: any) => {
    try {
        return await commonFetch('/v1/friendtrade_dispatch_batch_emplyees', {
            emplyeeIds: emplyeeIds,
        });
    } catch (error) {}
};
const getEmplyeeIds = () => {
    const { emplyeeIds, workProfitIds } = tokenInfo.workerList.reduce(
        (accumulator: any, employee: any) => {
            if (multipleSelection.value.includes(employee.userId)) {
                // 没有挖矿结束时间，需要挖矿
                if (employee.workEndTimestamp === 0) {
                    // 有挖矿收益，需要收矿
                    if (employee.workProfit) {
                        // 收矿列表
                        accumulator.workProfitIds.push(employee.userId);
                    } else {
                        // 挖矿列表
                        accumulator.emplyeeIds.push(employee.userId);
                    }
                }
            }
            return accumulator;
        },
        { emplyeeIds: [], workProfitIds: [] }
    );

    return { emplyeeIds, workProfitIds };
};
const handleBatchWork = async () => {
    const { emplyeeIds, workProfitIds } = getEmplyeeIds();
    console.log('🚀 ~ handleBatchWork ~ getEmplyeeIds.value:', { emplyeeIds, workProfitIds });

    if (workProfitIds.length) {
        workProfitIds.forEach((e: any) => {
            friendTradeTakeWorkCoin(e);
        });
    }

    if (emplyeeIds.length) {
        await friendTradeDispatchBatchEmplyees(emplyeeIds);
    }
};
let timerAutoBatch: any = null;
const autoButtonClick = () => {
    isAutoWorking.value = !isAutoWorking.value;
    clearInterval(timerAutoBatch);
    if (isAutoWorking.value) {
        handleBatchWork();
        timerAutoBatch = setInterval(handleBatchWork, 10000);
    }
};
const showUserInfo = computed(() => {
    return tokenInput && tokenInfo.userInfo.holdersNum;
});

const friendTradeTakeWorkCoin = async (employeeId: string) => {
    try {
        return await commonFetch('/v1/friendtrade_takeworkcoin', {
            employeeId: employeeId,
        });
    } catch (error) {}
};
</script>

<template>
    <div class="gm-content">
        <el-form label-width="120px" label-position="top">
            <el-form-item label="TOKEN:">
                <el-input v-model="tokenInput" @blur="main" />
            </el-form-item>
        </el-form>

        <div v-if="showUserInfo">
            <h2 class="info-text">{{ tokenInfo.userInfo.platformData.platformMap[1].displayName }}</h2>
            <div class="user-info">
                <span>
                    <span>持有人：</span>
                    <span class="info-text">{{ tokenInfo.userInfo.holdersNum }}</span>
                </span>
                <span>
                    <span>持有：</span>
                    <span class="info-text">{{ tokenInfo.userInfo.holding }}</span>
                </span>
                <span>
                    <span>自持：</span>
                    <span class="info-text">{{ tokenInfo.userInfo.youOwnKeyNum }}</span>
                </span>
                <span>
                    <span>解锁最高矿场：</span>
                    <span class="info-text">{{ tokenInfo.userInfo.selfData.unlockWorkIds.length }}</span>
                </span>
            </div>
            <div class="earn-info">
                <span>
                    <span>matic 余额：</span>
                    <span class="info-text">{{ Number(tokenInfo.userInfo.selfData.balance).toFixed(3) }}</span>
                </span>
                <span>
                    <span>$LFG Pool：</span>
                    <span class="info-text">{{ tokenInfo.userInfo.selfData.claimCoin }}</span>
                </span>
                <span>
                    <span>$LFG：</span>
                    <span class="info-text">{{ tokenInfo.userInfo.selfData.vCoin }}</span>
                </span>
                <span>
                    <span>$UP：</span>
                    <span class="info-text">{{ tokenInfo.userInfo.selfData.points }}</span>
                </span>
                <span>
                    <span>$power：</span>
                    <span class="info-text">{{ tokenInfo.userInfo.selfData.power }}</span>
                </span>
            </div>
            <div v-if="workerState.count">
                <el-button id="auto-button" @click="autoButtonClick" :type="isAutoWorking ? 'danger' : 'primary'">
                    <span v-if="isAutoWorking">运行中</span>
                    自动挖矿（{{ workerState.count }}）
                </el-button>
                <div class="kuangji-info">
                    <el-table
                        ref="multipleTableRef"
                        :data="tokenInfo.workerList"
                        style="width: 100%"
                        :row-key="(row) => row.userId"
                        @selection-change="handleSelectionChange"
                    >
                        <el-table-column :reserve-selection="true" type="selection" width="55" />
                        <el-table-column
                            :reserve-selection="true"
                            label="矿机名称"
                            width="120"
                            property="profile.displayName"
                        >
                            <template #header>
                                <div>挖矿中：{{ workerState.working }}</div>
                                <div>暂停中：{{ workerState.paused }}</div>
                                <div>总矿机：{{ workerState.count }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column :reserve-selection="true" property="tierId" label="等级" width="120" />
                        <el-table-column :reserve-selection="true" property="holdingNum" label="持有 key" />
                        <el-table-column :reserve-selection="true" property="buyPrice" label="价格">
                            <template #default="scope">
                                {{ `${Number(scope?.row?.buyPrice).toFixed(2)}` }}
                            </template>
                        </el-table-column>
                        <el-table-column :reserve-selection="true" property="energy" label="体力" />
                        <el-table-column :reserve-selection="true" label="当前矿场">
                            <template #default="scope">
                                {{ `${scope?.row?.workName} (${scope?.row?.workId})` }}
                            </template>
                        </el-table-column>
                        <el-table-column :reserve-selection="true" label="挖矿利润">
                            <template #header>
                                <div>挖矿利润</div>
                                <div>（{{ Number(workerState.selfWorkProfit).toFixed(3) }}）</div>
                            </template>
                            <template #default="scope">{{ `${scope?.row?.selfWorkProfit}` }}</template>
                        </el-table-column>
                        <el-table-column :reserve-selection="true" label="挖矿结束时间">
                            <template #default="scope">
                                {{
                                    scope?.row?.workEndTimestamp
                                        ? moment(scope?.row?.workEndTimestamp * 1000).format('YYYY-MM-DD HH:mm:ss')
                                        : ''
                                }}
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.gm-content {
    width: 70vw;
    margin: 0 auto;
}
.user-info > span,
.earn-info > span {
    margin-right: 20px;
}
.user-info,
.earn-info {
    margin: 10px 0;
}
.info-text {
    color: #308ce2;
}
.kuangji-info {
    margin-top: 20px;
    border: 1px solid #ebeef5;
}
#auto-button {
    display: block;
    margin: 10px auto;
}
</style>
