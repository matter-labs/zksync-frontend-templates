<script lang="ts">
  import { onDestroy } from 'svelte';
  import { writable, derived } from 'svelte/store';
  import { watchPendingTransactions } from '@wagmi/core';
  import type { Hash } from 'viem';
  import { wagmiConfig } from '../stores/wagmi';

  let transactionHashes = writable<Hash[]>([]);

  let reversedTransactionHashes = derived(transactionHashes, $transactionHashes =>
    [...$transactionHashes].reverse()
  );

  const unwatch = watchPendingTransactions(wagmiConfig, {
    onTransactions(newHashes) {
      transactionHashes.update(existingHashes => 
        Array.from(new Set([...existingHashes, ...newHashes]))
      );
    },
  });

  onDestroy(() => {
    unwatch();
  });
</script>

<div>
  <details>
    <summary>{$reversedTransactionHashes.length} transaction hashes</summary>
    <pre>{$reversedTransactionHashes.join('\n')}</pre>
  </details>
</div>
