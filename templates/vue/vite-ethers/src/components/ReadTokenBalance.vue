<template>
  <div>
    <div>
      Token balance: {{ balance?.toString() }}
    </div>
    <div>
      <input v-model="address" type="text" placeholder="wallet address">
      <button @click="fetchBalance">{{ inProgress ? 'fetching...' : 'refetch' }}</button>
    </div>
    <div v-if="error">Error: {{ error?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Contract } from 'zksync-ethers';

import { daiContractConfig } from '@/utils/contracts';
import { useAsync } from '@/composables/useAsync';
import { getProvider, account } from "@/ethers"

const address = ref(account.value.address);

const { result: balance, execute: fetchBalance, inProgress, error} = useAsync(async () => {
  const contract = new Contract(daiContractConfig.address, daiContractConfig.abi, getProvider()!);
  return contract.balanceOf(address.value!);
});

fetchBalance();
</script>