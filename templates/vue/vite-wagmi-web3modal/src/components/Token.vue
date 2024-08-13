<template>
  <div>
    <form @submit.prevent="fetchCurrentToken">
      <input v-model="tokenAddress" placeholder="token address" />
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
import { ref } from "vue";
import { readContracts } from '@wagmi/core';
import { stringify } from '@/utils/formatters';
import { daiContractConfig } from '@/utils/contracts';
import { useAsync } from '@/composables/useAsync';
import { erc20Abi } from "viem";
import { wagmiConfig } from '../wagmi'; 

const tokenAddress = ref(daiContractConfig.address);

const { result: token, execute: fetchToken, inProgress, error } = useAsync(async () => {
  return await readContracts(wagmiConfig, {
    allowFailure: false, 
    contracts: [
      {
        address: tokenAddress.value, 
        abi: erc20Abi,
        functionName: 'decimals',
      },
      {
        address: tokenAddress.value, 
        abi: erc20Abi,
        functionName: 'name',
      },
      {
        address: tokenAddress.value, 
        abi: erc20Abi,
        functionName: 'symbol',
      },
      {
        address: tokenAddress.value, 
        abi: erc20Abi,
        functionName: 'totalSupply',
      },
    ],
  });
});

</script>const fetchCurrentToken = () => {
  fetchToken();
};
