<template>
  <slot v-if="account.isConnected" />
</template>

<script lang="ts" setup>
import { account } from '@/wagmi';
</script>