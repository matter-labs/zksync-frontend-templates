<template>
  <div>
    <div>
      Find balance:
      <input v-model="address" type="text" placeholder="wallet address">
      <button @click="() => fetchBalance({ address: address as Address })">{{ inProgress ? 'fetching...' : 'fetch' }}</button>
    </div>
    <div>{{ balance?.formatted }}</div>
    <div v-if="error">Error: {{ error?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { fetchBalance as wagmiFetchBalance, type Address } from '@wagmi/core';

const address = ref("");

const { result: balance, execute: fetchBalance, inProgress, error} = useAsync(wagmiFetchBalance);
</script>