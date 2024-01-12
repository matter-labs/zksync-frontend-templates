<template>
  <slot v-if="account.isConnected" />
</template>

<script lang="ts" setup>
const { account } = storeToRefs(useEthers())
</script>