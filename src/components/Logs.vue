<script setup lang="ts">
import type { TransactionResult } from '@/service/transaction';
import { TransactionResultStatus } from '@/service/transaction';
import moment from 'moment';
import { ref } from 'vue';

let logs: any = ref([]);
let transSuccessCount = ref(0);

const clearLog = () => {
    logs.value = [];
}

const logCallback = (result: TransactionResult) => {
    if (result.status === TransactionResultStatus.SUCCESS) {
        logs.value.unshift("✅ " + moment().format('YYYY-MM-DD HH:mm:ss') + "--" + result.msg);
        transSuccessCount.value = result.successCount;
    } else {
        logs.value.unshift("❌ " + moment().format('YYYY-MM-DD HH:mm:ss') + "--" + result.msg);
    }
}
defineExpose({ logCallback })
</script>
<template>
    <el-row>
        <el-col :span="24">
            <div class="logs">
                <span>交易成功次数：{{ transSuccessCount }}</span>
                <el-button class="clear-btn" type="warning" @click="clearLog()">清除日志</el-button>
            </div>
            <el-card>
                <el-scrollbar style="height: 300px;">
                    <el-row v-for="item in logs">
                        <!-- <el-alert title="item" type="success" effect="dark" /> -->
                        {{ item }}
                    </el-row>
                </el-scrollbar>
            </el-card>
        </el-col>
    </el-row>
</template>

<style>
.logs {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
}

.clear-btn {
    margin-left: 20px;
    float: right;
}
</style>