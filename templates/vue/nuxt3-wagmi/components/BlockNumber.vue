<template>
  <div>
    {{ blockNumber?.toString() }}
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { watchBlockNumber } from '@wagmi/core';
import { useWagmi } from '../store/wagmi';
import { storeToRefs } from 'pinia';

const { wagmiConfig } = storeToRefs(useWagmi());
const blockNumber = ref<bigint | null>(null);

const unwatch = watchBlockNumber(wagmiConfig.value, {
  emitOnBegin: true,
  onBlockNumber(newBlockNumber) {
    blockNumber.value = newBlockNumber;
  },
  onError(error) {
    console.error('Error fetching block number:', error);
  },
});

// Optional: Call unwatch() when the component unmounts or you no longer need to track block numbers
</script>
