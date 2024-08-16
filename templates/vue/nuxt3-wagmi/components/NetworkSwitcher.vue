<template>
  <div>
    <div>
      Connected to {{ currentChain?.name ?? currentChain?.id }}
    </div>
    <br />
    <div>
      Switch to:
      <button
        v-for="chain in chains"
        :key="chain.id"
        @click="handleSwitchNetwork(chain.id)"
        :disabled="!account.isConnected || currentChain?.id === chain.id"
      >
        {{ chain.name }}
      </button>
    </div>

    <div v-if="error">Error: {{ error?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { switchChain, getAccount } from '@wagmi/core';
import type { Chain } from 'viem';

const { account } = storeToRefs(useWagmi());
const chains = ref<Chain[]>([...wagmiConfig.chains]);
const { execute: switchNetwork, error } = useAsync(switchChain);

const currentChain = computed(() => {
  return chains.value.find((chain) => chain.id === account.value.chainId) || null;
});

const handleSwitchNetwork = async (chainId: number) => {
  if (account.value.isConnected) {
    await switchNetwork(wagmiConfig, { chainId });
  }
};

</script>
