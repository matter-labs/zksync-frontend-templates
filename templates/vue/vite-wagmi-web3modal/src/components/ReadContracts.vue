<template>
  <div>
    <div>Data:</div>
    <div v-if="inProgress">loading...</div>
    <div v-if="formattedResults.length">
      <pre v-for="(item, index) in formattedResults" :key="index">{{ item.label }}: {{ item.value }}</pre>
    </div>
    <div v-if="error">Error: {{ error?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { readContracts } from '@wagmi/core';
import { daiContractConfig } from '@/utils/contracts';
import { useAsync } from '@/composables/useAsync';
import { account } from '@/wagmi';
import { wagmiConfig } from "../wagmi";
import { formatUnits } from 'viem';

const formattedResults = ref<{ label: string, value: string }[]>([]);

const { execute: fetchContracts, inProgress, error } = useAsync(async () => {
  const response = await readContracts(wagmiConfig, {
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
    ],
  });

  formattedResults.value = response.map((item, index) => {
    let label = '';
    let value = '';
    switch (index) {
      case 0:
        label = 'Token Balance';
        value = item.result !== undefined ? formatUnits(item.result as bigint, 18) : 'N/A'; 
        break;
      case 1:
        label = 'Token Name';
        value = item.result !== undefined ? String(item.result) : 'N/A';
        break;
      case 2:
        label = 'Total Supply';
        value = item.result !== undefined ? formatUnits(item.result as bigint, 18) : 'N/A';
        break;
      default:
        label = 'Unknown';
    }
    return { label, value };
  });

  return response;
});

fetchContracts();
</script>