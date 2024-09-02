<template>
  <div>
    <div>
      Find balance:
      <input v-model="address" type="text" placeholder="wallet address">
      <button @click="() => fetchBalance(wagmiConfig, { address: address as Address })">{{ inProgress ? 'fetching...' : 'fetch' }}</button>
    </div>
    <div>{{ formattedBalance }}</div>
    <div v-if="error">Error: {{ error?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { getBalance } from '@wagmi/core';
import type { Address } from 'viem';
import { wagmiConfig } from '../store/wagmi.js';
import { formatEther } from 'viem'; 
import { useAsync } from '@/composables/useAsync';

const address = ref("");

const { result: balance, execute: fetchBalance, inProgress, error } = useAsync(getBalance);

const formattedBalance = computed(() => {
    return balance.value ? formatEther(balance.value.value) : '0.0';
});

</script>
