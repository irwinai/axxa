<script setup lang="ts">
import ToolsJsonData from '@/data/tools';
import { ref } from 'vue';
import Item from '@/components/Item.vue';
let toolsData: any = ref(ToolsJsonData);

</script>

<template>
  <Item :itemData="toolsData" />
</template>
