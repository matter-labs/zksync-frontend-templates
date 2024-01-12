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
const { connect, disconnect } = useEthers()
const { account } = storeToRefs(useEthers())
</script>