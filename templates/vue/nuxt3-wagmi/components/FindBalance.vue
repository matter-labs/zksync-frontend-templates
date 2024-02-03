<template>
  <div>
    <div>
      Find balance:
      <input v-model="address" type="text" placeholder="wallet address">
      <button @click="fetchBalance">{{ inProgress ? 'fetching...' : 'fetch' }}</button>
    </div>
    <div>{{ formattedBalance }}</div>
    <div v-if="error">Error: {{ error?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getBalance } from '@wagmi/core';
import { formatUnits } from 'viem';
import { useWagmi } from '../store/wagmi';
import { storeToRefs } from 'pinia';

const { wagmiConfig } = storeToRefs(useWagmi());
const address = ref("");
const balance = ref(null);
const formattedBalance = ref("");
const error = ref(null);
const inProgress = ref(false);

const fetchBalance = async () => {
  if (!address.value) {
    error.value = new Error("Address is required");
    return;
  }
  inProgress.value = true;
  try {
    const balanceResult = await getBalance(wagmiConfig.value, { address: address.value });
    balance.value = balanceResult;
    formattedBalance.value = formatUnits(balanceResult.value, balanceResult.decimals);
    error.value = null;
  } catch (err) {
    error.value = err;
    balance.value = null;
    formattedBalance.value = "";
  } finally {
    inProgress.value = false;
  }
};
</script>
