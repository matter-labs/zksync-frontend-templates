<template>
  <div>
    <div>
      Find balance:
      <input v-model="address" type="text" placeholder="wallet address">
      <button @click="() => fetchBalance(address)">{{ inProgress ? 'fetching...' : 'fetch' }}</button>
    </div>
    <div>{{ balance ? ethers.formatEther(balance): "" }}</div>
    <div v-if="error">Error: {{ error?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ethers } from 'ethers';

import { useAsync } from '@/composables/useAsync';
import { getProvider } from "@/ethers"

const address = ref("");

const { result: balance, execute: fetchBalance, inProgress, error} = useAsync((address) => getProvider()!.getBalance(address));
</script>