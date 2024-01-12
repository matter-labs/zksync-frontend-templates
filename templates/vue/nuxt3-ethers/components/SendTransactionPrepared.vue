<template>
  <div>
    <form @submit.prevent="sendTransaction">
      <input v-model="address" placeholder="address" />
      <input v-model="value" placeholder="value (ether)" />
      <button :disabled="prepareInProgress || !preparedTransaction" type="submit">Send</button>
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
import { ethers } from 'ethers';

const { getSigner, getProvider } = useEthers()

const address = ref<string | null>(null);
const value = ref<string | null>(null);

const { result: preparedTransaction, execute: prepareTransaction, inProgress: prepareInProgress, error: prepareError} = useAsync(async () => {
  const transaction = {
    to: address.value!,
    value: ethers.parseEther(value.value!),
  }
  const gasPrice = await getProvider()!.getGasPrice();
  const gasLimit = await (await getSigner())!.estimateGas({
    to: address.value!,
    value: ethers.parseEther(value.value!),
    gasPrice,
  });

  return {
    ...transaction,
    gasPrice,
    gasLimit,
  }
});
const { result: transaction, execute: sendTransaction, inProgress, error} = useAsync(async () => {
  const result = await (await getSigner())!.sendTransaction(preparedTransaction.value!)
  waitForReceipt(result.hash);
  return result;
});
const { result: receipt, execute: waitForReceipt, inProgress: receiptInProgress, error: receiptError} = useAsync(async (transactionHash) => {
  return await getProvider()!.waitForTransaction(transactionHash);
});

watch([address, value], () => {
  if (!address.value || !value.value) return;
  prepareTransaction();
}, { immediate: true });
</script>