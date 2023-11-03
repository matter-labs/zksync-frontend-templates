<template>
  <div>
    <div>
      Total Supply: {{ supply?.toString() }}
      <button @click="fetchTotalSupply">{{ inProgress ? 'fetching...' : 'refetch' }}</button>
    </div>
    <div v-if="error">Error: {{ error?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { Contract } from 'zksync-web3';

import { usdcContractConfig } from '@/utils/contracts';
import { useAsync } from '@/composables/useAsync';
import { getProvider } from "@/ethers"

const { result: supply, execute: fetchTotalSupply, inProgress, error} = useAsync(async () => {
  const contract = new Contract(usdcContractConfig.address, usdcContractConfig.abi, getProvider()!);
  return await contract.totalSupply();
});

fetchTotalSupply();
</script>