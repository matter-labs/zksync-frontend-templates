<template>
  <div>
    <form @submit.prevent="sendTransaction">
      <input v-model="amount" type="number" placeholder="allowance amount" />
      <button :disabled="prepareInProgress || !preparedTransaction" type="submit">Approve</button>
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
import { Contract } from 'zksync-ethers';

const { getSigner, getProvider } = useEthers()
const amount = ref<string | null>(null);

const getContractInstance = async () => {
  return new Contract(daiContractConfig.address, daiContractConfig.abi, await getSigner()!);
}

// Preparing the transaction
const { result: preparedTransaction, execute: prepareTransaction, inProgress: prepareInProgress, error: prepareError } = useAsync(async () => {
  const contract = await getContractInstance();

  // random address for testing, replace with contract address that you want to allow to spend your tokens
  const spender = "0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044"
  
  const gasPrice = await getProvider()!.getGasPrice();
  const gasLimit = await contract.getFunction("approve").estimateGas(spender, amount.value);

  return {
    args: [spender, amount.value],
    overrides: {
      gasPrice,
      gasLimit
    }
  }
});

const { result: transaction, execute: sendTransaction, inProgress, error } = useAsync(async () => {
  const contract = await getContractInstance();
  const transaction = preparedTransaction.value!;
  const result = await contract.approve(...transaction.args, transaction.overrides)
  waitForReceipt(result.hash);
  return result;
});

const { result: receipt, execute: waitForReceipt, inProgress: receiptInProgress, error: receiptError } = useAsync(async (transactionHash) => {
  return await getProvider()!.waitForTransaction(transactionHash);
});

watch(amount, () => {
  if (!amount.value) return;
  prepareTransaction();
}, { immediate: true });
</script>