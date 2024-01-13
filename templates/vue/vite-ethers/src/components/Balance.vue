<template>
  <div>
    <div>
      Connected wallet balance:
      {{ balance ? ethers.formatEther(balance): "" }}
      <button @click="getAccountBalance">refetch</button>
    </div>
    <div v-if="error">Error: {{ error?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { watch } from "vue";
import { ethers } from 'ethers';

import { useAsync } from '@/composables/useAsync';
import { getProvider, account } from "@/ethers";

const { result: balance, execute: fetchBalance, inProgress, error} = useAsync((address) => getProvider()!.getBalance(address));
const getAccountBalance = () => fetchBalance(account.value.address);

watch(account, ({ address }) => {
  if (!address) return;
  getAccountBalance();
}, { immediate: true });
</script>