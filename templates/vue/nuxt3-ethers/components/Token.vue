<template>
  <div>
    <form @submit.prevent="fetchCurrentToken">
      <input
        v-model="tokenAddress"
        placeholder="token address"
      />
      <button type="submit">fetch</button>
    </form>
    <div v-if="inProgress">Fetching token...</div>
    <div v-else-if="token">
      <pre>{{ stringify(token, null, 4) }}</pre>
    </div>
    <div v-else-if="error">Error: {{ error?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { Contract } from 'zksync-ethers';

const { getProvider } = useEthers()

const tokenAddress = ref(daiContractConfig.address)

const { result: token, execute: fetchToken, inProgress, error} = useAsync(async (address: string) => {
  const contract = new Contract(address, erc20ABI, getProvider()!);
  const [symbol, name, decimals, supply] = await Promise.all([
    contract.symbol(),
    contract.name(),
    contract.decimals(),
    contract.totalSupply(),
  ]);
  return {
    symbol,
    name,
    decimals,
    supply,
  }
})
const fetchCurrentToken = () => fetchToken(tokenAddress.value)
</script>