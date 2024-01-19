<script setup lang="ts">
import ToolsJsonData from '@/data/tools';
import DevToolsJsonData from '@/data/dev-tools';

import { ref } from 'vue';
import Item from '@/components/Item.vue';
let toolsData: any = ref(ToolsJsonData);
let devToolsData: any = ref(DevToolsJsonData);

</script>

<template>
  <Item :itemData="toolsData" />
  <Item :itemData="devToolsData" />
</template>
