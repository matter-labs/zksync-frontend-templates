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
import { ref, watch } from "vue"
import { prepareWriteContract as wagmiPrepareWriteContract, writeContract as wagmiWriteContract, waitForTransaction } from '@wagmi/core';

import { stringify } from '@/utils/formatters';
import { daiContractConfig } from '@/utils/contracts';
import { useAsync } from '@/composables/useAsync';
import { account } from '@/wagmi';

const amount = ref<string | null>(null);

const { result: preparedWriteContract, execute: prepareTransaction, inProgress: prepareInProgress, error: prepareError} = useAsync(async () => {
  // random address for testing, replace with contract address that you want to allow to spend your tokens
  const spender = "0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044"
  
  return await wagmiPrepareWriteContract({
    ...daiContractConfig,
    functionName: 'approve',
    args: [spender, BigInt(amount.value!)]
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