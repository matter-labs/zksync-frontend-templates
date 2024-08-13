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
import { ref, onMounted, computed } from 'vue';
import { switchChain, getAccount } from '@wagmi/core';
import { useAsync } from '@/composables/useAsync';
import { wagmiConfig } from '../wagmi';
import { Chain } from 'viem';

const account = ref(getAccount(wagmiConfig));
const { execute: switchNetwork, error } = useAsync(switchChain);

const chains = ref<Chain[]>([...wagmiConfig.chains]);

const currentChain = computed(() => {
  return chains.value.find((chain) => chain.id === account.value.chainId) || null;
});

const handleSwitchNetwork = async (chainId: number) => {
  if (account.value.isConnected) {
    await switchNetwork(wagmiConfig, { chainId });
  }
};

</script>onMounted(() => {
  account.value = getAccount(wagmiConfig);
});
