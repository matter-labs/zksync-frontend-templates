<script lang="ts">
  import { readContract } from "@wagmi/core";
  import { useAsync } from "../composables/useAsync";
  import { daiContractConfig } from "../utils/contracts";
  import { onMount } from "svelte";

  const { state, execute: fetchTotalSupply } = useAsync(async () => {
    return await readContract({
      ...daiContractConfig,
      functionName: "totalSupply",
    });
  });
  $: ({ inProgress, error, result: supply } = $state);

  onMount(fetchTotalSupply);
</script>

<div>
  <div>
    Total Supply: {supply?.toString() ?? ""}
    <button on:click={fetchTotalSupply}
      >{inProgress ? "fetching..." : "refetch"}</button
    >
  </div>
  {#if error}
    <div>Error: {error?.message}</div>
  {/if}
</div>
