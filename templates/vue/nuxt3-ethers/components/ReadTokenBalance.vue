<template>
  <div>
    <div>
      Token balance: {{ balance?.toString() }}
    </div>
    <div>
      <input v-model="address" type="text" placeholder="wallet address">
      <button @click="fetchBalance">{{ inProgress ? 'fetching...' : 'refetch' }}</button>
    </div>
    <div v-if="error">Error: {{ error?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { Contract } from 'zksync-ethers';

const { getProvider } = useEthers()
const { account } = storeToRefs(useEthers());

const address = ref(account.value.address);

const { result: balance, execute: fetchBalance, inProgress, error} = useAsync(async () => {
  const contract = new Contract(daiContractConfig.address, daiContractConfig.abi, getProvider()!);
  return contract.balanceOf(address.value!);
});

fetchBalance();
</script>