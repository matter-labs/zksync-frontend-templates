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
import { getBalance} from '@wagmi/core';
import { formatUnits } from 'viem';

const { account } = storeToRefs(useWagmi());
const formattedBalance = ref<string | null>(null);

const { result: balance, execute: fetchBalance, inProgress, error} = useAsync(getBalance);
const getAccountBalance = () => {
  fetchBalance(wagmiConfig, { address: account.value.address! }).then(result => {
    if (result) {
      formattedBalance.value = formatUnits(result.value, result.decimals); 
    }
  });
};

watch(account, ({ address }) => {
  if (!address) return;
  getAccountBalance();
}, { immediate: true });
</script>
