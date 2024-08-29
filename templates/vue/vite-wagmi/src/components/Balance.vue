<template>
  <div>
    <div>
      Connected wallet balance:
      {{ formattedBalance }}
      <button @click="getAccountBalance">refetch</button>
    </div>
    <div v-if="error">Error: {{ error?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { getBalance as wagmiFetchBalance } from '@wagmi/core';
import { wagmiConfig } from '../wagmi'; 
import { formatUnits } from 'viem'; 
import { useAsync } from '@/composables/useAsync';
import { account } from '@/wagmi';

const { execute: fetchBalance, error } = useAsync(wagmiFetchBalance);

const formattedBalance = ref<string | null>(null);

const getAccountBalance = () => {
  fetchBalance(wagmiConfig, { address: account.value.address! }).then(result => {
    if (result) {
      formattedBalance.value = formatUnits(result.value, result.decimals); 
    }
  });
};

watch(account, ({ address }) => {
  if (!address) return;
  getAccountBalance();
}, { immediate: true });
</script>