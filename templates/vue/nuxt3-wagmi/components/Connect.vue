<template>
  <div>
    <button v-if="account.value" @click="disconnectWallet">
      Disconnect
    </button>

    <template v-else>
      <button v-for="connector in wagmiConfig.value.connectors" :key="connector.name" @click="() => connectWallet(connector)">
        Connect with {{ connector.name }}
      </button>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { connect, disconnect } from '@wagmi/core';
import { useWagmi } from '../store/wagmi';
import { storeToRefs } from 'pinia';

const { wagmiConfig } = storeToRefs(useWagmi());
const account = ref(null);

const connectWallet = async (connector: any) => {
  try {
    const result = await connect(wagmiConfig.value, { connector: connector() });
    account.value = result.accounts[0];
  } catch (error) {
    console.error('Failed to connect:', error);
  }
};

const disconnectWallet = async () => {
  try {
    await disconnect(wagmiConfig.value);
    account.value = null;
  } catch (error) {
    console.error('Failed to disconnect:', error);
  }
};
</script>
