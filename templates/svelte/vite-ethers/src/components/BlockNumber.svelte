<script lang="ts">
  import { etherStore } from "../ethers";

  let blockNumber: bigint | null = null;

  etherStore.getProvider()!.on("block", (block) => {
    blockNumber = block;
  });
</script>

<div>
  {blockNumber?.toString()}
</div>
