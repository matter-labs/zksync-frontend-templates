<script lang="ts">
  import { writable, derived } from 'svelte/store';
  import { getBalance } from '@wagmi/core';
  import type { Address } from 'viem';
  import { formatEther } from 'viem';
  import { get } from 'svelte/store';
  import { useAsync } from '../composables/useAsync';
  import { wagmiConfig } from '../wagmi';

  let address = writable("");

  const { state, execute: fetchBalance } = useAsync(async () => {
    const addr = get(address);
    if (addr) {
      return getBalance(wagmiConfig, { address: addr as Address });
    }
    return null;
  });

  const balance = derived(state, ($state) => $state?.result || null);
  const error = derived(state, ($state) => $state?.error || null);
  const inProgress = derived(state, ($state) => $state?.inProgress || false);

  const formattedBalance = derived(balance, ($balance) => {
    return $balance ? formatEther($balance.value) : '0.0';
  });
</script>

<div>
  <div>
    Find balance:
    <input bind:value={$address} type="text" placeholder="wallet address" />
    <button on:click={() => fetchBalance()} disabled={$inProgress}>
      {$inProgress ? 'fetching...' : 'fetch'}
    </button>
  </div>
  <div>{$formattedBalance}</div>
  {#if $error}
    <div>Error: {$error?.message}</div>
  {/if}
</div>
