<template>
  <div>
    {{ account.address }}
  </div>
</template>

<script lang="ts" setup>
import { account } from '@/wagmi';
</script>