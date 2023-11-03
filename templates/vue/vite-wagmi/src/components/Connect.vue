<template>
  <div>
    <button v-if="account.isConnected" @click="disconnect">
      Disconnect from {{ account.connector?.name }}
    </button>

    <template v-else>
      <button v-for="item in config.connectors" :key="item.id" @click="connect({ connector: item })">
        {{ item.name }}
      </button>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { connect, disconnect, getConfig } from '@wagmi/core';
import { account } from "@/wagmi"

const config = getConfig();
</script>