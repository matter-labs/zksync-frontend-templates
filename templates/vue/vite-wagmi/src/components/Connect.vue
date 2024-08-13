<template>
  <div>
    <button v-if="account.isConnected" @click="handleDisconnect">
      Disconnect from {{ account.connector?.name }}
    </button>

    <template v-else>
      <button
        v-for="item in connectors"
        :key="item.id"
        @click="() => handleConnect(item)"
      >
        Connect with {{ item.name }}
      </button>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { connect, disconnect, type Connector } from '@wagmi/core';
import { account } from '@/wagmi';
import { wagmiConfig } from "../wagmi";

const connectors = ref(wagmiConfig.connectors);

const handleConnect = async (connector: Connector) => {
  try {
    await connect(wagmiConfig,{ connector }); 
  } catch (error) {
    console.error("Error connecting:", error);
  }
};

const handleDisconnect = async () => {
  try {
    await disconnect(wagmiConfig); 
    account.value.isConnected = false; 
  } catch (error) {
    console.error("Error disconnecting:", error);
  }
};
</script>
