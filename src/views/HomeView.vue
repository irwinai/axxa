<script setup lang="ts">
import MarketJsonData from '@/data/market';
import MarketNormalJsonData from '@/data/market-normal';
import { ref } from 'vue';
import Item from '@/components/Item.vue';

let marketData: any = ref(MarketJsonData);
let marketNormalData: any = ref(MarketNormalJsonData);

</script>

<template>
  <Item :itemData="marketData" />
  <Item :itemData="marketNormalData" />
</template>
