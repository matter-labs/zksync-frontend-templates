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
import { readContract } from '@wagmi/core';

import { daiContractConfig } from '@/utils/contracts';
import { useAsync } from '@/composables/useAsync';
import { wagmiConfig } from '../wagmi';


const { result: supply, execute: fetchTotalSupply, inProgress, error} = useAsync(async () => {
  return await readContract(wagmiConfig,{
    ...daiContractConfig,
    functionName: 'totalSupply',
  })
});

fetchTotalSupply();
</script>