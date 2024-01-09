<script setup lang="ts">
import { chainList } from '@/data/chain';
import { getCurrentInstance, ref, watch } from 'vue';
defineProps({
    network: String,
});
const emits = defineEmits(['change', 'update:network']);

const { proxy } = getCurrentInstance() as any;
const networkInner = ref(proxy.network);

const chains = Object.values(chainList).map((item: any) => {
    return {
        id: item.id,
        name: item.name,
        rpc: item.rpcUrls.default.http[0]
    }
});


const changeChain = () => {
    let chain = chains.find((item: any) => item.name === networkInner.value);
    if (chain) {
        emits('change', chain);
    }
}

watch(() => proxy.network, (newValue) => {
    networkInner.value = newValue;
})
</script>

<template>
    <el-select class="net-select" v-model="networkInner" placeholder="请选择网络" filterable size="large"
        @change="changeChain()">
        <el-option v-for="item in chains" :label="item.name" :value="item.name" :key="item.id">
        </el-option>
    </el-select>
</template>