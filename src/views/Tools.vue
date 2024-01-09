<script setup lang="ts">
import ToolsJsonData from '@/data/tools';
import { ref } from 'vue';
import Item from '@/components/Item.vue';
const formRef = ref<FormInstance>()

let toolsData: any = ref(ToolsJsonData);

</script>

<template>
  <Item :itemData="toolsData" />
</template>
