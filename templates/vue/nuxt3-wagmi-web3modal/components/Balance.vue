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
import { getBalance } from '@wagmi/core';

const { account } = storeToRefs(useWagmi());

const { result: balance, execute: fetchBalance, inProgress, error} = useAsync(getBalance);
const getAccountBalance = () => fetchBalance(wagmiConfig, { address: account.value.address! });

watch(account, ({ address }) => {
  if (!address) return;
  getAccountBalance();
}, { immediate: true });
</script>
