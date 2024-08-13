<template>
  <div>
    <div>
      Find balance:
      <input v-model="address" type="text" placeholder="wallet address">
      <button @click="() => fetchBalance(wagmiConfig, { address: address as Address })">{{ inProgress ? 'fetching...' : 'fetch' }}</button>
    </div>
    <div>{{ balance?.formatted }}</div>
    <div v-if="error">Error: {{ error?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { getBalance } from '@wagmi/core';

import { useAsync } from '@/composables/useAsync';
import { Address } from "viem";
import { wagmiConfig } from '../wagmi'; 

const address = ref("");

</script>const { result: balance, execute: fetchBalance, inProgress, error} = useAsync(getBalance);
