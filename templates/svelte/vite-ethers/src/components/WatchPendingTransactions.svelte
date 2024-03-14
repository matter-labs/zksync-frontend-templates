<script lang="ts">
  import { etherStore } from "../ethers";
  import { BrowserProvider } from "zksync-ethers";

  const { getProvider } = etherStore;

  let transactionHashes: string[] = [];

  let provider: BrowserProvider = getProvider()!;

  provider.on("block", async (blockNumber) => {
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
