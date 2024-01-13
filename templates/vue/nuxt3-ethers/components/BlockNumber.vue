<template>
  <div>
    {{ blockNumber?.toString() }}
  </div>
</template>

<script lang="ts" setup>
const { getProvider } = useEthers()

const blockNumber = ref<bigint | null>(null);
getProvider()!.on("block", (block) => {
  blockNumber.value = block;
});
</script>