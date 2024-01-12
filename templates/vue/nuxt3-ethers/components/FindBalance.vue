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
import { ethers } from 'ethers';

const { getProvider } = useEthers()

const address = ref("");

const { result: balance, execute: fetchBalance, inProgress, error} = useAsync((address) => getProvider()!.getBalance(address));
</script>