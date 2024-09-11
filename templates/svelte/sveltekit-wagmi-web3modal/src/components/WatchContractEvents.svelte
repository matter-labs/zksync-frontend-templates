<script lang="ts">
  import { onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import { watchContractEvent } from '@wagmi/core';
  import type { Log } from 'viem';
  import { daiContractConfig } from '../utils/contracts';
  import { wagmiConfig } from '../stores/wagmi';

  let events = writable<Log[]>([]);

  const unsubscribe = watchContractEvent(wagmiConfig, {
    ...daiContractConfig,
    eventName: 'Transfer',
    onLogs(logs) {
      events.update(existingLogs => [...existingLogs, ...logs]);
    },
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<div>
  <details>
    <summary>{$events.length} DAI `Transfer`s logged</summary>
    <pre>
    {$events
      .slice() 
      .reverse()
      .map((log) => JSON.stringify(log, null, 2)) 
      .join('\n\n\n\n')}
    </pre>
  </details>
</div>
