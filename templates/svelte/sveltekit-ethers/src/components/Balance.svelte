<script lang="ts">
  import { ethers } from "ethers";
  import { etherStore } from "../stores/ethers";
  import { useAsync } from "../composables/useAsync";

  const { state: asyncState, execute: fetchBalance } = useAsync((address) =>
    etherStore.getProvider()!.getBalance(address),
  );
  $: ({ result: balance, error, inProgress } = $asyncState);

  const getAccountBalance = () => fetchBalance($etherStore.account.address);
  $: $etherStore.account.address && getAccountBalance();
</script>

<div>
  <div>
    Connected wallet balance:
    {balance ? ethers.formatEther(balance) : ""}
    <button on:click={getAccountBalance}>refetch</button>
  </div>
  {#if error}
    Error: {error?.message}
  {/if}
</div>
