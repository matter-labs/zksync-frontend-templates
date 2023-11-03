<template>
  <div>
    <form @submit.prevent="fetchCurrentToken">
      <input
        v-model="tokenAddress"
        placeholder="token address"
      />
      <button type="submit">fetch</button>
    </form>
    <div v-if="inProgress">Fetching token...</div>
    <div v-else-if="token">
      <pre>{{ stringify(token, null, 4) }}</pre>
    </div>
    <div v-else-if="error">Error: {{ error?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { fetchToken as wagmiFetchToken } from '@wagmi/core';

import { stringify } from '@/utils/formatters';
import { daiContractConfig } from '@/utils/contracts';
import { useAsync } from '@/composables/useAsync';

const tokenAddress = ref(daiContractConfig.address)

const { result: token, execute: fetchToken, inProgress, error} = useAsync(wagmiFetchToken)
const fetchCurrentToken = () => fetchToken({ address: tokenAddress.value })
</script>