<template>
  <div>
    <details>
      <summary>{{ reversedTransactionHashes.length }} transaction hashes</summary>
      {{ reversedTransactionHashes.join('\n') }}
    </details>
  </div>
</template>

<script lang="ts" setup>
import { watchPendingTransactions } from '@wagmi/core';
import type { Hash } from 'viem';

const transactionHashes = ref<Hash[]>([]);

const reversedTransactionHashes = computed(() => [...transactionHashes.value].reverse());

watchEffect(() => {
  const unwatch = watchPendingTransactions(wagmiConfig, {
    onTransactions(newHashes) {
      transactionHashes.value = Array.from(new Set([...transactionHashes.value, ...newHashes]));
    },
  });

  // Clean up the watcher when the component is unmounted
  return () => {
    unwatch();
  };
});
</script>
