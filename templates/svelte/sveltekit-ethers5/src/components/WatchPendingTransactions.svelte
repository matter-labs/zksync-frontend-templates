<script lang="ts">
  import { etherStore } from "../stores/ethers";

  const { getProvider } = etherStore;

  let transactionHashes: string[] = [];

  let provider = getProvider()!;

  provider.on("block", async (blockNumber: number) => {
    const block = await provider.getBlock(blockNumber);
    transactionHashes = [...transactionHashes, ...block.transactions];
  });
</script>

<div>
  <details>
    <summary>{transactionHashes.length} transaction hashes</summary>

    {transactionHashes.reverse().join("\n")}
  </details>
</div>
