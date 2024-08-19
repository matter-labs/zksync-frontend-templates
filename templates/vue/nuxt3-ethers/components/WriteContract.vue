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
import { ref } from 'vue';
import { Contract, Provider, types, utils } from 'zksync-ethers';
import { stringify } from '@/utils/formatters';
import { daiContractConfig } from '@/utils/contracts';
import { useAsync } from '@/composables/useAsync';

const { getSigner, getProvider } = useEthers()
const amount = ref<string | null>(null);

const { result: transaction, execute: writeContract, inProgress, error } = useAsync(async () => {
  const signer = await getSigner();
  if (!signer) throw new Error("Signer not available");

  const contract = new Contract(daiContractConfig.address, daiContractConfig.abi, signer);

  // random address for testing, replace with contract address that you want to allow to spend your tokens
  const spender = "0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044";
  
  if (!amount.value) throw new Error("Allowance amount is not set");

  const amountBigInt = BigInt(amount.value);

  const provider = Provider.getDefaultProvider(types.Network.Sepolia);
  const fee = await provider.estimateFee({
    from: await signer.getAddress(),
    to: daiContractConfig.address,
    value: `0x${amountBigInt.toString(16)}`,
  });

  console.log(`Estimated Fee: ${utils.toJSON(fee)}`);

  const transaction = await contract.approve(spender, amount.value, {
    gasLimit: fee.gasLimit,
    gasPrice: fee.maxFeePerGas,
  });

  waitForReceipt(transaction.hash);
  return transaction;
});

const { result: receipt, execute: waitForReceipt, inProgress: receiptInProgress, error: receiptError } = useAsync(async (transactionHash) => {
  const provider = getProvider();
  return await provider?.waitForTransaction(transactionHash);
});
</script>
