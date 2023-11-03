<template>
  <div>
    <div>
      Connected wallet balance:
      {{ balance ? formatEther(balance): "" }}
      <button @click="getAccountBalance">refetch</button>
    </div>
    <div v-if="error">Error: {{ error?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { formatEther } from 'ethers/lib/utils';

const { getProvider } = useEthers()
const { account } = storeToRefs(useEthers())

const { result: balance, execute: fetchBalance, inProgress, error} = useAsync((address) => getProvider()!.getBalance(address));
const getAccountBalance = () => fetchBalance(account.value.address);

watch(account, ({ address }) => {
  if (!address) return;
  getAccountBalance();
}, { immediate: true });
</script>