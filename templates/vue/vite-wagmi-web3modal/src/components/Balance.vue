<template>
  <div>
    <div>
      Connected wallet balance:
      {{ balance?.formatted }}
      <button @click="getAccountBalance">refetch</button>
    </div>
    <div v-if="error">Error: {{ error?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { watch } from "vue"
import { getBalance as wagmiFetchBalance } from '@wagmi/core';

import { useAsync } from '@/composables/useAsync';
import { account } from '@/wagmi';
import { wagmiConfig } from '../wagmi'; 

const { result: balance, execute: fetchBalance, error} = useAsync(wagmiFetchBalance);
const getAccountBalance = () => fetchBalance(wagmiConfig,{ address: account.value.address! });

watch(account, ({ address }) => {
  if (!address) return;
  getAccountBalance();
}, { immediate: true });
</script>