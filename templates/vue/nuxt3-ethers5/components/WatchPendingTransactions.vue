<template>
  <div>
    <details>
      <summary>{{ transactionHashes.length }} transaction hashes</summary>
      
      {{ transactionHashes.reverse().join('\n') }}
    </details>
  </div>
</template>

<script lang="ts" setup>
const { getProvider } = useEthers()

const transactionHashes = ref<string[]>([]);

const provider = getProvider()!;

provider.on("block", async (blockNumber) => {
  const block = await provider.getBlock(blockNumber);
  transactionHashes.value.push(...block.transactions);
});
</script>