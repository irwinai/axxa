<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import { getEvmTokenJsonFromHex, getEvmTokenMintHex } from '@/service/common';
import { useAccountStore } from "@/stores/store";
const store = useAccountStore();
const form = reactive({
    address: '',
    protocol: 'bsc-20',
    tick: ''
});
let loading = ref(false);
let inscriptionData = ref([]);
let paging = reactive({
    page: 1,
    pageSize: 50,
    total: 0

});

const url = '/api?type=POST&targetUrl=https://api.evm.ink/v1/graphql/';

const inscriptionRequestJson = computed(() => {
    return {
        "query": "query GetUserInscriptions($limit: Int, $offset: Int, $order_by: [inscriptions_order_by!] = {}, $where: inscriptions_bool_exp = {}, $whereAggregate: inscriptions_bool_exp = {}) {\n  inscriptions_aggregate(where: $whereAggregate) {\n    aggregate {\n      count\n    }\n  }\n  inscriptions(limit: $limit, offset: $offset, order_by: $order_by, where: $where) {\n    block_number\n    confirmed\n    content_uri\n    created_at\n    creator_address\n    owner_address\n    trx_hash\n    id\n    position\n    category\n    mtype\n    internal_trx_index\n    network_id\n    brc20_command {\n      reason\n      is_valid\n    }\n  }\n}",
        "variables": {
            "limit": paging.pageSize,
            "offset": (paging.page - 1) * paging.pageSize,
            "order_by": [
                {
                    "position": "desc"
                }
            ],
            "whereAggregate": {
                "owner_address": {
                    "_eq": form.address.toLowerCase()
                },
                "network_id": {
                    "_eq": "eip155:56"
                },
                ...(form.tick !== '' && { "content_uri": { "_eq": getEvmTokenMintHex(form.tick, form.protocol) } })
            },
            "where": {
                "owner_address": {
                    "_eq": form.address.toLowerCase()
                },
                "network_id": {
                    "_eq": "eip155:56"
                },
                ...(form.tick !== '' && { "content_uri": { "_eq": getEvmTokenMintHex(form.tick, form.protocol) } })
            }
        },
        "operationName": "GetUserInscriptions"
    }
});

onMounted(() => {
    form.address = store.account;
})

watch(() => store.account, (newValue) => {
    form.address = newValue;
})

const query = async () => {
    if (form.address === '') {
        return;
    }
    loading.value = true;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(inscriptionRequestJson.value)
    }).then((r) => {
        return r.json();
    }).then((data) => {
        if (data.errors) {
            ElMessage.error(data.errors[0].extensions.code + ' ' + data.errors[0].message);
            return;
        }
        paging.total = data.data.inscriptions_aggregate.aggregate.count;
        inscriptionData.value = data.data.inscriptions.map((item: any) => {
            let mintJson: any = getEvmTokenJsonFromHex(item.content_uri);
            if (mintJson.startsWith('{')) {
                mintJson = JSON.parse(mintJson);
            } else {
                mintJson = {
                    "p": "bsc-20",
                    "op": "mint",
                    "tick": "bnbs",
                    "amt": "1000"
                };
            }
            return {
                id: item.id,
                block_number: item.block_number,
                tick: mintJson,
                trx_hash: item.trx_hash,
                brc20_command: item.brc20_command,
                created_at: item.created_at,
            }
        });
        console.log(inscriptionData);
    }).catch((err) => {
        console.log(err);
        ElMessage.error('查询失败');
    }).finally(() => {
        loading.value = false;
    })
}

const handleCurrentChange = (val: number) => {
    paging.page = val;
    query();
}

</script>
<template>
    <el-form :model="form" :inline="true">
        <el-form-item>
            <el-input style="width: 400px;" v-model="form.address" placeholder="请输入查询地址,大小写没关系" size="large">
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-input style="width: 200px;" v-model="form.protocol" placeholder="请输入协议名称，比如bsc-20" size="large">
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-input style="width: 600px;" v-model="form.tick" placeholder="请输入铭文名称, 比如: sofi, bnbs由于官方索引数据问题，无法筛选，自己翻页查询"
                size="large">
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="query()" :loading="loading" size="large">
                查询
            </el-button>
        </el-form-item>

    </el-form>

    <el-table :data="inscriptionData" stripe style="width: 100%" v-loading="loading" height="500">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="" label="铭文">
            <template #default="scope">
                <el-tooltip :content="JSON.stringify(scope.row.tick)" placement="top" effect="customized">
                    <el-tag size="large">
                        {{ scope.row.tick.tick }}
                    </el-tag>
                </el-tooltip>
            </template>
        </el-table-column>
        <el-table-column prop="block_number" label="区块高度" />
        <el-table-column prop="trx_hash" label="交易Hash">
        </el-table-column>
        <el-table-column prop="" label="是否有效">
            <template #default="scope">
                <el-tag size="large"
                    :type="scope.row.brc20_command ? scope.row.brc20_command.is_valid ? 'success' : 'danger' : 'success'">
                    {{ scope.row.brc20_command ? scope.row.brc20_command.is_valid ? '有效' : '无效' : '有效' }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" />
        <el-table-column prop="" label="操作">
            <template #default="scope">
                <el-button type="primary" tag="a" target="_blank"
                    :href="'https://evm.ink/marketplace/eip155:56/' + scope.row.trx_hash + ':0'">去挂单</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-row class="page">
        <el-pagination background layout="total,prev, pager,next, jumper " :total="paging.total"
            :page-size="paging.pageSize" :current-page="paging.page" @current-change="handleCurrentChange" />
    </el-row>
</template>

<style>
.el-popper.is-customized {
    /* Set padding to ensure the height is 32px */
    padding: 6px 12px;
    background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}

.el-popper.is-customized .el-popper__arrow::before {
    background: linear-gradient(45deg, #b2e68d, #bce689);
    right: 0;
}

.page {
    margin-top: 20px;
}
</style>