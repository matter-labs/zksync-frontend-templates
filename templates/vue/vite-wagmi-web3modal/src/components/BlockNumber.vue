<template>
  <div>
    {{ blockNumber?.toString() }}
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { watchBlockNumber } from '@wagmi/core';
import { wagmiConfig } from '../wagmi'; 

const blockNumber = ref<bigint | null>(null);
watchBlockNumber(
  {
    ...wagmiConfig, 
    listen: true, 
  },
  {  
    onBlockNumber(block) {
     blockNumber.value = block;
  },
});
</script>