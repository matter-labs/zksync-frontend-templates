<script lang="ts">
  import { wagmiStore } from "../wagmi";
  import { useAsync } from "../composables/useAsync";
  import { fetchBalance as wagmiFetchBalance } from "@wagmi/core";

  const { state: asyncState, execute: fetchBalance } =
    useAsync(wagmiFetchBalance);
  $: ({ result: balance, error, inProgress } = $asyncState);

  const getAccountBalance = () =>
    fetchBalance({ address: $wagmiStore.account.address! });
  $: $wagmiStore.account.address && getAccountBalance();
</script>

<div>
  <div>
    Connected wallet balance:
    {balance?.formatted}
    <button on:click={getAccountBalance}>refetch</button>
  </div>
  {#if error}
    Error: {error?.message}
  {/if}
</div>
