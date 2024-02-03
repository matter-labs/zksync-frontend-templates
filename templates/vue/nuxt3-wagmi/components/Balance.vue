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
import { ref, watch } from 'vue';
import { formatUnits } from 'viem';
import { getBalance } from '@wagmi/core';
import { useWagmi } from '../store/wagmi';
import { storeToRefs } from 'pinia';

const { account, wagmiConfig } = storeToRefs(useWagmi());
const balance = ref(null);
const error = ref(null);
const formattedBalance = ref('');

const getAccountBalance = async () => {
  if (!account.value) return;
  try {
    const balanceResult = await getBalance(wagmiConfig.value, { address: account.value.address });
    balance.value = balanceResult;
    formattedBalance.value = formatUnits(balanceResult.value, balanceResult.decimals);
  } catch (err) {
    error.value = err;
  }
};

watch(account, (newAccount) => {
  if (!newAccount.address) return;
  getAccountBalance();
}, { immediate: true });
</script>
