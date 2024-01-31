<script setup lang="ts">
import AirDropJsonData from '@/data/airdrop/airdrop';
import AirDropToolData from '@/data/airdrop/airdrop-tools';

import { ref } from 'vue';
import Item from '@/components/Item.vue';
let airDropData: any = ref(AirDropJsonData);
let airDropTool: any = ref(AirDropToolData);
</script>

<template>
  <Item :itemData="airDropData" />
  <Item :itemData="airDropTool" />
</template>

@/data/airdrop/airdrop