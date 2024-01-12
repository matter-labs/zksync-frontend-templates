<template>
  <div>
    <button v-if="account.isConnected" @click="disconnect">
      Disconnect wallet
    </button>

    <button v-else @click="connect()">
      Connect wallet
    </button>
  </div>
</template>

<script lang="ts" setup>
import { connect, disconnect, account } from "@/ethers"
</script>