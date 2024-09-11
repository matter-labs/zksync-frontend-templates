<script lang="ts">
  import { watchBlockNumber } from "@wagmi/core";
  import { wagmiConfig } from "../stores/wagmi";
  import { onDestroy } from "svelte";

  let blockNumber: bigint | null = null;

  const unsubscribe = watchBlockNumber(
    {
      ...wagmiConfig,
      listen: true,
    },
    {
      onBlockNumber(block) {
        blockNumber = block;
      },
    }
  );

  onDestroy(() => {
    unsubscribe();
  });
</script>

<div>
  {#if blockNumber !== null}
    {blockNumber.toString()}
  {:else}
    Loading...
  {/if}
</div>
