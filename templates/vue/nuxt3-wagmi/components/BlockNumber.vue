<template>
  <div>
    {{ blockNumber?.toString() }}
  </div>
</template>

<script lang="ts" setup>
import { watchBlockNumber } from '@wagmi/core';

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
