<script lang="ts">
  import { watchBlockNumber } from "@wagmi/core";

  let blockNumber: bigint | null = null;

  watchBlockNumber({ listen: true }, (block) => {
    blockNumber = block;
  });
</script>

<div>
  {blockNumber?.toString()}
</div>
