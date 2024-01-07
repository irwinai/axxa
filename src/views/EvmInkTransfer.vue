<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, reactive, ref } from 'vue';
import { ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { evmBatchTransfer, type EvmInkTransaction } from '@/service/evmink';
import { chainList } from '@/data/chain';
import Logs from '@/components/Logs.vue';
import { getEvmTokenMintHex } from '@/service/common';

const { proxy } = getCurrentInstance() as any;

interface TransferForm {
    privateKey: string;
    num: string;
    address: string;
    tick: string;
    protocol: string;
}

const formRef = ref<FormInstance>()
let transferLoading = ref(false);
let transferForm = reactive<TransferForm>({
    privateKey: '',
    num: '1',
    address: '',
    tick: '',
    protocol: 'bsc-20',
});

const batchTransfer = async (formEl: FormInstance | undefined) => {
    if (!formEl) {
        return;
    }
    formEl.validate(async (valid, fields) => {
        if (valid) {
            transferLoading.value = true;
            let requestParams: EvmInkTransaction = {
                rpc: Object.values(chainList).filter((item) => {
                    return item.network === 'bsc';
                })[0].rpcUrls.default.http[0],
                privateKey: [transferForm.privateKey],
                to: transferForm.address,
                num: Number(transferForm.num),
                tick: getEvmTokenMintHex(transferForm.tick, transferForm.protocol),
            }
            //evm 批量转账
            await evmBatchTransfer(requestParams, proxy.$refs.logs.logCallback);
            transferLoading.value = false;
        } else {
            console.log('error submit!', fields)
        }
    })
}

const numValidate = (rule: any, value: any, callback: any) => {
    let reg = /^[0-9]+.?[0-9]*$/;
    if (value !== '' && !reg.test(value)) {
        callback(new Error('请输入数字'));
    } else if (value <= 0) {
        callback(new Error('数量必须大于0'));
    } else {
        callback();
    }
}

const rules = reactive<FormRules>({
    privateKey: [
        { required: true, message: '请输入私钥', trigger: 'blur' }
    ],
    address: [{ required: true, message: '请输入转入地址', trigger: 'blur', }
    ],
    num: [
        {
            required: true,
            validator: numValidate,
            trigger: 'blur',
        }
    ],
    tick: [{ required: true, message: '请输入铭文内容', trigger: 'blur', }
    ],
    protocol: [{ required: true, message: '请输入协议', trigger: 'blur', }
    ],
});

</script>
<template>
    <el-form :model="transferForm" :rules="rules" ref="formRef" label-width="120px" status-icon>
        <el-form-item label="私钥" prop="privateKey" size="large">
            <el-input v-model="transferForm.privateKey" autocomplete="off" placeholder="请输入私钥, 有没有0x都行" />
        </el-form-item>
        <el-form-item label="数量" prop="num" size="large">
            <el-input v-model="transferForm.num" autocomplete="off" min="1" placeholder="请输入转账数量，单位：张" />
        </el-form-item>
        <el-form-item label="协议" prop="protocol" size="large">
            <el-input v-model="transferForm.protocol" placeholder="请输入需要转移的铭文所属协议，比如: bsc-20" />
        </el-form-item>
        <el-form-item label="铭文" prop="tick" size="large">
            <el-input v-model="transferForm.tick" placeholder="请输入需要转移的铭文名称，比如: sofi, bnbs由于无法查询，无法支持，请到余额查询中手工查询转账" />
        </el-form-item>
        <el-form-item label="转入地址" prop="address" size="large">
            <el-input v-model="transferForm.address" autocomplete="off" placeholder="请输入转入地址 " />
        </el-form-item>
        <el-form-item>
            <el-col :span="24">
                <el-button style="width: 100%;" class="btn-submit" type="primary" size="large"
                    @click="batchTransfer(formRef)" :loading="transferLoading">开始转账</el-button>
            </el-col>
        </el-form-item>
    </el-form>
    <Logs ref="logs"></Logs>
</template>

<style></style>