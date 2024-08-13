<template>
  <div>
    <form @submit.prevent="sendTransaction">
      <input v-model="address" placeholder="address" />
      <input v-model="value" placeholder="value (ether)" />
      <button :disabled="prepareInProgress || !preparedTransaction" type="submit">Send</button>
    </form>

    <div v-if="inProgress">Transaction pending...</div>
    <div v-else-if="transaction">
      <div>Transaction Hash: {{ transaction }}</div>
      <div>
        Transaction Receipt:
        <span v-if="receiptInProgress">pending...</span>
        <pre>{{ stringify(receipt, null, 2) }}</pre>
      </div>
    </div>

    <div v-if="prepareError">Preparing Transaction Error: {{ prepareError?.message }}</div>
    <div v-if="error">Error: {{ error?.message }}</div>
    <div v-if="receiptError">Receipt Error: {{ receiptError?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { parseEther, type Address } from 'viem';
import { estimateGas, sendTransaction as wagmiSendTransaction, waitForTransactionReceipt } from '@wagmi/core';

import { stringify } from '@/utils/formatters';
import { useAsync } from '@/composables/useAsync';
import { wagmiConfig } from '../wagmi'; 

const address = ref<Address | null>(null);
const value = ref<string | null>(null);

const { result: preparedTransaction, execute: prepareTransaction, inProgress: prepareInProgress, error: prepareError } = useAsync(async () => {
  const gasEstimate = await estimateGas(wagmiConfig, {
    to: address.value!,
    value: parseEther(value.value!) 
  });

  return {
    to: address.value!,
    value: parseEther(value.value!), 
    gas: gasEstimate
  };
});

const { result: transaction, execute: sendTransaction, inProgress, error } = useAsync(async () => {
  if (!preparedTransaction.value) throw new Error('Transaction not prepared');
  const result = await wagmiSendTransaction(wagmiConfig,{
    to: preparedTransaction.value.to,
    value: preparedTransaction.value.value, 
    gas: preparedTransaction.value.gas,
  });
  waitForReceipt(result); 
  return result;
});

const { result: receipt, execute: waitForReceipt, inProgress: receiptInProgress, error: receiptError } = useAsync(async (transactionHash: `0x${string}`) => {
  return await waitForTransactionReceipt(wagmiConfig, { hash: transactionHash });
});

watch([address, value], () => {
  if (!address.value || !value.value) return;
  prepareTransaction();
}, { immediate: true });
</script>
