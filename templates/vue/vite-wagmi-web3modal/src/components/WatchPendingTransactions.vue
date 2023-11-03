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
import { watchPendingTransactions, type Hash } from '@wagmi/core';

const transactionHashes = ref<Hash[]>([]);

watchPendingTransactions({}, (hashes) => {
  transactionHashes.value.push(...hashes);
});
</script>