<script setup lang="ts">
import { chainList } from '@/data/chain';
import { batchInscription, shouldExitLoop, type Transaction } from '@/service/transaction';
import type { FormInstance, FormRules } from 'element-plus'
import { getCurrentInstance, proxyRefs, reactive, ref } from 'vue'
import Logs from '@/components/Logs.vue';

const formRef = ref<FormInstance>()
const { proxy } = getCurrentInstance() as any;

const chains = Object.values(chainList).map((item: any) => {
    return {
        id: item.id,
        name: item.name,
        rpc: item.rpcUrls.default.http[0]
    }
});
const form: any = reactive({
    network: chains[0].name,
    privateKey: '',
    content: '',
    address: '',
    rpc: chains[0].rpc,
    gas: '0',
    data: ''
});

const sendToSelf = ref(true);
const isRunning = ref(false);

const addressValite = (rule: any, value: string, callback: any) => {
    if (value === '' && !sendToSelf.value) {
        callback(new Error('请输入接收地址'));
    } else {
        callback();
    }
}

const gasValidate = (rule: any, value: string, callback: any) => {
    //正则判断是否为数字
    let reg = /^[0-9]+.?[0-9]*$/;
    if (value !== '' && !reg.test(value)) {
        callback(new Error('请输入数字'));
    } else if (parseFloat(value) < 0) {
        callback(new Error('请输入大于0的数字'));
    } else {
        callback();
    }


}

const rules = reactive<FormRules>({
    network: [
        { required: true, message: '请选择网络', trigger: 'change' }
    ],
    privateKey: [
        { required: true, message: '请输入私钥', trigger: 'blur' }
    ],
    content: [
        {
            required: true,
            message: '请输入铭刻内容',
            trigger: 'blur',
        }
    ],
    address: [
        {
            validator: addressValite,
            trigger: 'blur',
        }
    ],
    gas: [
        {
            validator: gasValidate,
            trigger: 'blur',
        }
    ],
});

const addressControl = (status: boolean) => {
    if (status) {
        sendToSelf.value = true;
        form.address = '';
    } else {
        sendToSelf.value = false;
    }
}

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) {
        return;
    }
    formEl.validate((valid, fields) => {
        if (valid) {
            isRunning.value = true;
            let requestParams: Transaction = {
                privateKey: form.privateKey.split('\n'),
                memo: form.content,
                to: form.address,
                rpc: form.rpc,
                gas: form.gas,
            }
            //批量铭刻，死循环
            batchInscription(requestParams, proxy.$refs.logs.logCallback);
        } else {
            console.log('error submit!', fields)
        }
    })
}

const stop = () => {
    isRunning.value = false;
    shouldExitLoop();
}

const changeChain = () => {
    let chain = chains.find((item: any) => item.name === form.network);
    if (chain) {
        form.rpc = chain.rpc;
    }
}
</script>
<template>
    <el-form :model="form" :rules="rules" label-width="120px" ref="formRef" status-icon>
        <el-form-item label="网络" prop="network">
            <el-col :span="6">
                <el-select class="net-select" v-model="form.network" placeholder="请选择网络" filterable size="large"
                    @change="changeChain()">
                    <el-option v-for="item in chains" :label="item.name" :value="item.name" :key="item.id">
                    </el-option>
                </el-select>
            </el-col>
        </el-form-item>
        <el-form-item label="私钥" prop="privateKey">
            <el-input size="large" v-model="form.privateKey" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
                placeholder="请输入私钥，每行一个" />
        </el-form-item>
        <el-form-item label="铭文内容" prop="content">
            <el-input size="large" v-model="form.content" :autosize="{ minRows: 2, maxRows: 4 }" type="input"
                placeholder="请输入铭文，例子：
data:,{&quot;p&quot;:&quot;asc-20&quot;,&quot;op&quot;:&quot;mint&quot;,&quot;tick&quot;:&quot;aval&quot;,&quot;amt&quot;:&quot;100000000&quot;}" />
        </el-form-item>
        <el-form-item label="接收地址" prop="address">
            <el-switch size="large" v-model="sendToSelf" active-text="自转" @change="addressControl"></el-switch>
            <el-input size="large" v-model="form.address" placeholder="请输入接收地址" :disabled="sendToSelf" />
        </el-form-item>
        <el-form-item label="RPC">
            <el-input size="large" v-model="form.rpc" placeholder="请输入RPC地址,支持HTTP、WebSocket" />
        </el-form-item>
        <el-form-item label="额外Gas" prop="gas">
            <el-col :span="6">
                <el-input size="large" v-model="form.gas" placeholder="请输入额外Gas，默认为0">
                    <template #append>Gwei</template>
                </el-input>
            </el-col>
        </el-form-item>
        <el-form-item>
            <el-col :span="24">
                <el-button class="btn-submit" type="primary" size="large" @click="submitForm(formRef)"
                    v-if="!isRunning">开始运行</el-button>
                <el-button class="btn-submit" type="danger" size="large" @click="stop()" v-else>停止运行</el-button>
            </el-col>
        </el-form-item>
    </el-form>

    <Logs ref="logs"></Logs>
</template>

<style>
.btn-submit {
    width: 100%;
}

.net-select {
    width: 100%;
}
</style>