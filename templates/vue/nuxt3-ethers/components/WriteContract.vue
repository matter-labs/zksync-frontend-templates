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
import { Contract } from 'zksync-ethers';

const { getSigner, getProvider } = useEthers()
const amount = ref<string | null>(null);

const { result: transaction, execute: writeContract, inProgress, error} = useAsync(async () => {
  const contract = new Contract(daiContractConfig.address, daiContractConfig.abi, await getSigner()!);

  // random address for testing, replace with contract address that you want to allow to spend your tokens
  const spender = "0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044"
  
  const transaction = await contract.approve(spender, amount.value);

  waitForReceipt(transaction.hash);
  return transaction;
});
const { result: receipt, execute: waitForReceipt, inProgress: receiptInProgress, error: receiptError} = useAsync(async (transactionHash) => {
  return await getProvider()!.waitForTransaction(transactionHash);
});
</script>