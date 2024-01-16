<script setup lang="ts">
import AirDropJsonData from '@/data/airdrop';

import { ref } from 'vue';
import Item from '@/components/Item.vue';
let airDropData: any = ref(AirDropJsonData);

</script>

<template>
  <Item :itemData="airDropData" />
</template>
