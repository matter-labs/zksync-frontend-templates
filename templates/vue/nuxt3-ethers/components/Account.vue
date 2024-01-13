<template>
  <div>
    {{ account.address }}
  </div>
</template>

<script lang="ts" setup>
const { account } = storeToRefs(useEthers())
</script>