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

import { usdcContractConfig } from '@/utils/contracts';
import { useAsync } from '@/composables/useAsync';

const { result: supply, execute: fetchTotalSupply, inProgress, error} = useAsync(async () => {
  return await readContract({
    ...usdcContractConfig,
    functionName: 'totalSupply',
  })
});

fetchTotalSupply();
</script>