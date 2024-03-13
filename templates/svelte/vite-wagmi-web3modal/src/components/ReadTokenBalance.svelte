<script lang="ts">
  import { readContract } from "@wagmi/core";
  import { useAsync } from "../composables/useAsync";
  import { wagmiStore } from "../wagmi";
  import { daiContractConfig } from "../utils/contracts";
  import { onMount } from "svelte";

  $: ({ account } = $wagmiStore);

  const {
    state: asyncState,
    execute: fetchBalance,
  } = useAsync(async () => {
    return await readContract({
      ...daiContractConfig,
      functionName: "balanceOf",
      args: [account.address!],
    });
  });
  $: ({ inProgress, error, result: balance } = $asyncState);

  onMount(fetchBalance);
</script>

<div>
  <div>
    Token balance: {balance?.toString() ?? ""}
  </div>
  <div>
    <input
      bind:value={account.address}
      type="text"
      placeholder="wallet address"
    />
    <button on:click={fetchBalance}
      >{inProgress ? "fetching..." : "refetch"}</button
    >
  </div>
  {#if error}
    <div>Error: {error?.message}</div>
  {/if}
</div>
