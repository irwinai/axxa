<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getEvmTokenJson } from '@/service/common';
import { useAccountStore } from "@/stores/store";
const store = useAccountStore();

const form = reactive({
    address: '',
});
let loading = ref(false);
let balanceData = ref([]);

const url = '/api?type=POST&targetUrl=https://api.evm.ink/v1/graphql/';
const requestJson = computed(() => {
    return {
        "query": "query GetBrc20UserBalances($limit: Int = 10, $offset: Int = 0, $order_by: [brc20_user_balances_order_by!] = {}, $where: brc20_user_balances_bool_exp = {}) {\n  brc20_user_balances(\n    limit: $limit\n    offset: $offset\n    order_by: $order_by\n    where: $where\n  ) {  \n    balance\n    owner\n    protocol\n    tick\n    network_id\n    token {\n      decimal_digits\n    }\n  }\n}",
        "variables": {
            "limit": 20,
            "offset": 0,
            "order_by": [
                {
                    "balance": "desc"
                }
            ],
            "where": {
                "balance": {
                    "_gt": 0
                },
                "owner": {
                    "_eq": form.address.toLowerCase()
                },
                "network_id": {
                    "_eq": "eip155:56"
                }
            }
        },
        "operationName": "GetBrc20UserBalances"
    }
});

onMounted(() => {
    form.address = store.account;
})

watch(() => store.account, (newValue) => {
    form.address = newValue;
})

const submitForm = () => {
    loading.value = true;
    if (form.address === '') {
        return;
    }
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestJson.value)
    }).then((r) => {
        return r.json();
    }).then((data) => {
        if (data.errors) {
            ElMessage.error(data.errors[0].extensions.code + ' ' + data.errors[0].message);
            return;
        }
        balanceData.value = data.data.brc20_user_balances.map((item: any) => {
            const tokenJson: any = getEvmTokenJson(item.tick, item.protocol);
            const balance = item.balance / item.token.decimal_digits;
            return {
                tick: item.tick,
                balance: balance,
                protocol: item.protocol,
                zhang: balance / tokenJson.amt,
            }
        });
    }).catch((err) => {
        ElMessage.error("查询失败");
        console.log(err);
    }).finally(() => {
        loading.value = false;
    })
}
</script>
<template>
    <el-form :model="form">
        <el-form-item>
            <el-input v-model="form.address" placeholder="请输入查询地址,大小写没关系" class="input-with-select" size="large">
                <template #prepend>
                    <el-button :icon="Search" />
                </template>
                <template #append>
                    <el-button type="primary" @click="submitForm()" :loading="loading">
                        查询
                    </el-button>
                </template>
            </el-input>
        </el-form-item>
    </el-form>

    <el-table :data="balanceData" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="" label="铭文">
            <template #default="scope">
                <el-tag size="large">
                    {{ scope.row.tick }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="protocol" label="协议" />
        <el-table-column prop="balance" label="数量（个）" />
        <el-table-column prop="zhang" label="张数" />
    </el-table>
</template>

<style></style>