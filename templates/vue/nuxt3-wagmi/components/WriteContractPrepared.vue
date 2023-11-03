<template>
  <div>
    <form @submit.prevent="sendTransaction">
      <input v-model="amount" type="number" placeholder="allowance amount" />
      <button :disabled="prepareInProgress || !preparedWriteContract" type="submit">Approve</button>
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

    <div v-if="prepareError">Preparing Transaction Error: {{ prepareError?.message }}</div>
    <div v-if="error">Error: {{ error?.message }}</div>
    <div v-if="receiptError">Receipt Error: {{ receiptError?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { prepareWriteContract as wagmiPrepareWriteContract, writeContract as wagmiWriteContract, waitForTransaction } from '@wagmi/core';

const { account } = storeToRefs(useWagmi());
const amount = ref<string | null>(null);

const { result: preparedWriteContract, execute: prepareTransaction, inProgress: prepareInProgress, error: prepareError} = useAsync(async () => {
  return await wagmiPrepareWriteContract({
    ...usdcContractConfig,
    functionName: 'approve',
    args: [account.value.address!, BigInt(amount.value!)]
  });
});
const { result: transaction, execute: sendTransaction, inProgress, error} = useAsync(async () => {
  const result =  await wagmiWriteContract(preparedWriteContract.value!)
  waitForReceipt(result.hash);
  return result;
});
const { result: receipt, execute: waitForReceipt, inProgress: receiptInProgress, error: receiptError} = useAsync(async (transactionHash) => {
  return await waitForTransaction({ hash: transactionHash });
});

watch([() => account.value.address, amount], ([_address, _amount]) => {
  if (!_address || !_amount) return;
  prepareTransaction();
}, { immediate: true });
</script>