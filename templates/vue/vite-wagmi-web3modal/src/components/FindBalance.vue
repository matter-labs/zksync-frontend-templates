<template>
  <div>
    <div>
      Find balance:
      <input v-model="address" type="text" placeholder="wallet address">
      <button @click="() => fetchBalance(wagmiConfig, { address: address as Address })">{{ inProgress ? 'fetching...' : 'fetch' }}</button>
    </div>
      <div>{{ balance ? formatUnits(balance.value, balance.decimals): "" }}</div>
    <div v-if="error">Error: {{ error?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { getBalance } from '@wagmi/core';

import { useAsync } from '@/composables/useAsync';
import { wagmiConfig } from '../wagmi';
import { formatUnits, type Address } from "viem";

const address = ref("");

const { result: balance, execute: fetchBalance, inProgress, error} = useAsync(getBalance);

</script>
