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
import { writeContract as wagmiWriteContract, waitForTransaction } from '@wagmi/core';

const { account } = storeToRefs(useWagmi());
const amount = ref<string | null>(null);

const { result: transaction, execute: writeContract, inProgress, error} = useAsync(async () => {
  const result = await wagmiWriteContract({
    ...usdcContractConfig,
    functionName: 'approve',
    args: [account.value.address!, BigInt(amount.value!)]
  })
  waitForReceipt(result.hash);
  return result;
});
const { result: receipt, execute: waitForReceipt, inProgress: receiptInProgress, error: receiptError} = useAsync(async (transactionHash) => {
  return await waitForTransaction({ hash: transactionHash });
});
</script>