<script lang="ts">
  import { watchPendingTransactions, type Hash } from "@wagmi/core";

  let transactionHashes: Hash[] = [];

  watchPendingTransactions({}, (hashes) => {
    transactionHashes = [...transactionHashes, ...hashes];
  });
</script>

<div>
  <details>
    <summary>{transactionHashes.length} transaction hashes</summary>

    {transactionHashes.reverse().join("\n")}
  </details>
</div>
