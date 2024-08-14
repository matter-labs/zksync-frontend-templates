<template>
  <div>
    <h3>Approve allowance</h3>
    <form @submit.prevent="writeContract">
      <input v-model="amount" type="number" placeholder="allowance amount" />
      <button type="submit" :disabled="inProgress">Approve</button>
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

    <div v-if="error">Error: {{ error?.message }}</div>
    <div v-if="receiptError">Receipt Error: {{ receiptError?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { writeContract as wagmiWriteContract, waitForTransactionReceipt } from '@wagmi/core';
import { stringify } from '@/utils/formatters';
import { daiContractConfig } from '@/utils/contracts';
import { useAsync } from '@/composables/useAsync';
import { wagmiConfig } from '../wagmi';

const amount = ref<string | null>(null);

const { result: transaction, execute: writeContract, inProgress, error } = useAsync(async () => {
  // random address for testing, replace with contract address that you want to allow to spend your tokens
  const spender = "0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044";
  
  if (!amount.value) {
    throw new Error("Amount is required");
  }

  const result = await wagmiWriteContract(wagmiConfig, {
    ...daiContractConfig,
    functionName: 'approve',
    args: [spender, BigInt(amount.value)]
  });

  return result as `0x${string}`; 
});

const { result: receipt, execute: waitForReceipt, inProgress: receiptInProgress, error: receiptError } = useAsync(async (transactionHash: `0x${string}`) => {
  return await waitForTransactionReceipt(wagmiConfig, { hash: transactionHash });
});

// Watch the transaction hash and fetch the receipt when available
watch(transaction, async (newTransaction) => {
  if (newTransaction) {
    await waitForReceipt(newTransaction as `0x${string}`);
  }
});
</script>