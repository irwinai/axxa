<script setup lang="ts">
import { createWallet } from '@/service/wallet';
import { ref, reactive, nextTick } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import SelectChain from '@/components/SelectChain.vue';
import EvmWalletWorker from '@/service/worker/evmWalletWorker.js?worker';
import { stringify } from 'csv-stringify';
import fs from 'fs';

const formRef = ref<FormInstance>();
const loading = ref(false);
const exportShow = ref(false);
const form: any = reactive({
    network: '',
    num: 1,
    rpc: '',
    mnemonicLen: 12,
})
let wallets: any = ref([]);
let successCount = ref(0);
const buttons = reactive([
    { length: 12, isActive: true },
    { length: 15, isActive: false },
    { length: 18, isActive: false },
    { length: 21, isActive: false },
    { length: 24, isActive: false },
]);

const changeChain = (chain: any) => {
    form.rpc = chain.rpc
    form.network = chain.name
}

const rules = ref<FormRules>({
    network: [
        { required: true, message: '请选择网络', trigger: 'change' }
    ],
    num: [
        { required: true, message: '请输入需要生成的钱包个数', trigger: 'blur' },
    ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) {
        return;
    }
    formEl.validate(async (valid, fields) => {
        if (valid) {
            loading.value = true;
            //重置数据
            wallets.value = [];
            successCount.value = 0;
            exportShow.value = false;
            // 创建一个新的 Worker 线程
            const worker = new EvmWalletWorker();
            // 监听 Worker 线程发送的消息
            worker.onmessage = function (event: any) {
                const { type, data } = event.data;
                if (type === 'walletCreated') {
                    successCount.value++;
                }
                wallets.value.unshift(data);
                if (successCount.value == form.num) {
                    loading.value = false;
                    exportShow.value = true;
                }
            };
            // 向 Worker 线程发送消息，请求创建钱包
            worker.postMessage({ type: 'createWallets', provider: form.rpc, num: form.num, mnemonicLen: form.mnemonicLen });
        } else {
            console.log('error submit!', fields)
        }
    })
}

const exportCsv = () => {
    stringify(wallets.value, {
        header: true,
        columns: {
            address: '钱包地址',
            mnemonic: '助记词',
            privateKey: '私钥',
        }
    }, function (err, output) {
        //导出文件
        const link = document.createElement('a');
        link.download = 'wallets.csv';
        const blob = new Blob([output], { type: 'text/csv' });
        link.href = URL.createObjectURL(blob);
        link.click();
        link.remove();
    });
}

const handleButtonClick = (index: number) => {
    buttons.forEach((btn, i) => {
        if (i === index) {
            btn.isActive = true;
            form.mnemonicLen = btn.length;
        } else {
            btn.isActive = false;
        }
    })
}
</script>

<template>
    <el-form :model="form" :rules="rules" label-width="120px" ref="formRef" status-icon>
        <el-form-item label="网络" prop="network">
            <el-col :span="6">
                <SelectChain v-model:network="form.network" @change="changeChain"></SelectChain>
            </el-col>
        </el-form-item>
        <el-form-item label="钱包个数" prop="num">
            <el-input-number size="large" v-model="form.num" :min="1" :max="500" />
        </el-form-item>
        <el-form-item label="助记词长度">
            <el-button @click="handleButtonClick(index)" class="btn-submit" :type="btn.isActive ? 'primary' : 'default'"
                size="large" v-for="(btn, index) in buttons">
                {{ btn.length }}
            </el-button>
            <input type="hidden" v-model="form.mnemonicLen" />
        </el-form-item>
        <el-form-item>
            <el-button class="btn-submit" type="primary" size="large" @click="submitForm(formRef)"
                :loading="loading">批量生成</el-button>
            <el-button class="btn-submit" type="success" size="large" @click="exportCsv()"
                v-if="exportShow">导出CSV</el-button>
        </el-form-item>
        <el-form-item label="成功数量">
            {{ successCount }} / {{ form.num }}
        </el-form-item>
    </el-form>
    <div>

    </div>
    <el-space :fill="true" wrap>
        <el-card class="box-card" v-for="(wallet, index) in wallets">
            <div>
                <p>
                    钱包地址：{{ wallet.address }}
                </p>
                <p>
                    助记词：{{ wallet.mnemonic }}
                </p>
                <p>
                    钱包私钥：{{ wallet.privateKey }}
                </p>
            </div>
        </el-card>
    </el-space>
</template>
<style>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>