<template>
  <div>
    <h3>Approve allowance</h3>
    <form @submit.prevent="writeContract">
      <input v-model="amount" type="number" placeholder="allowance amount" />
      <button type="submit">Approve</button>
    </form>

    <div v-if="inProgress">Transaction pending...</div>
    <div v-else-if="transaction">
      <div>Transaction Hash: {{ transaction?.hash }}</div>
      <div>
        Transaction Receipt:
        <span v-if="receiptInProgress">pending...</span>
        <pre>{{ stringify(receipt, null, 2)}}</pre>
      </div>
    </div>

    <div v-if="error">Error: {{ error?.message }}</div>
    <div v-if="receiptError">Receipt Error: {{ receiptError?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { writeContract as wagmiWriteContract, waitForTransaction } from '@wagmi/core';

import { stringify } from '@/utils/formatters';
import { daiContractConfig } from '@/utils/contracts';
import { useAsync } from '@/composables/useAsync';

const amount = ref<string | null>(null);

const { result: transaction, execute: writeContract, inProgress, error} = useAsync(async () => {
  // random address for testing, replace with contract address that you want to allow to spend your tokens
  const spender = "0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044"

  const result = await wagmiWriteContract({
    ...daiContractConfig,
    functionName: 'approve',
    args: [spender, BigInt(amount.value!)]
  })
  waitForReceipt(result.hash);
  return result;
});
const { result: receipt, execute: waitForReceipt, inProgress: receiptInProgress, error: receiptError} = useAsync(async (transactionHash) => {
  return await waitForTransaction({ hash: transactionHash });
});
</script>