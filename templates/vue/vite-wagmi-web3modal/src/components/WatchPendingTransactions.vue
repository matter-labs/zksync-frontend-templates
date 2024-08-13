<template>
  <div>
    <details>
      <summary>{{ transactionHashes.length }} transaction hashes</summary>
      
      {{ transactionHashes.reverse().join('\n') }}
    </details>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { watchPendingTransactions } from '@wagmi/core';
import { wagmiConfig } from '../wagmi';
import { Hash } from "viem";

const transactionHashes = ref<Hash[]>([]);

</script>watchPendingTransactions(wagmiConfig,{
    onTransactions(newHashes) {
      transactionHashes.value.push(...newHashes);
    },
    onError(err) {
      console.error('Error watching pending transactions:', err);
    },
  });
