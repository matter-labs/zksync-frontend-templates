<script lang="ts">
  import { wagmiConfig, wagmiStore } from "../wagmi";
  import { getBalance } from "@wagmi/core";
  import { formatUnits } from "viem";
  import { writable, get } from "svelte/store";

  const formattedBalance = writable<string | null>(null);
  const error = writable<Error | null>(null);

  const getAccountBalance = async () => {
    const account = get(wagmiStore).account;
    if (account && account.address) {
      try {
        const result = await getBalance(wagmiConfig, { address: account.address });
        if (result) {
          formattedBalance.set(formatUnits(result.value, result.decimals));
        }
      } catch (err) {
        error.set(err as Error);
      }
    }
  };
  $: get(wagmiStore).account.address && getAccountBalance();
</script>

<div>
  <div>
    Connected wallet balance:
    {$formattedBalance}
    <button on:click={getAccountBalance}>refetch</button>
  </div>
  {#if $error}
    <div>Error: {$error.message}</div>
  {/if}
</div>
