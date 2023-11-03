<template>
  <div>
    {{ blockNumber?.toString() }}
  </div>
</template>

<script lang="ts" setup>
import { watchBlockNumber } from '@wagmi/core';

const blockNumber = ref<bigint | null>(null);
watchBlockNumber({ listen: true }, (block) => {
  blockNumber.value = block;
});
</script>