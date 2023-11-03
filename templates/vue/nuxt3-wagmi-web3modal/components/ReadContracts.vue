<template>
  <div>
    <div>Data:</div>
    <div v-if="inProgress">loading...</div>
    <div v-if="results">
      <pre v-for="(item,index) in results" :key="index">{{ stringify(item) }}</pre>
    </div>
    <div v-if="error">Error: {{ error?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { readContracts } from '@wagmi/core';

const { account } = storeToRefs(useWagmi());

const { result: results, execute: fetchContracts, inProgress, error} = useAsync(async () => {
  return await readContracts({
    contracts: [
      {
        ...daiContractConfig,
        functionName: 'balanceOf',
        args: [account.value.address!],
      },
      {
        ...daiContractConfig,
        functionName: 'name',
      },
      {
        ...daiContractConfig,
        functionName: 'totalSupply',
      },
    ]
  })
});

fetchContracts();
</script>