<template>
  <div>
    {{ blockNumber?.toString() }}
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

import { getProvider } from "@/ethers"

const blockNumber = ref<bigint | null>(null);
getProvider()!.on("block", (block) => {
  blockNumber.value = block;
});
</script>