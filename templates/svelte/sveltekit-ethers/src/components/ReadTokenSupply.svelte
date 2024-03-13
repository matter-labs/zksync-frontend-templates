<script lang="ts">
  import { Contract } from "zksync-ethers";
  import { etherStore } from "../stores/ethers";
  import { useAsync } from "../composables/useAsync";
  import { daiContractConfig } from "../utils/contracts";
  import { onMount } from "svelte";

  const { getProvider } = etherStore;

  const { state, execute: fetchTotalSupply } = useAsync(async () => {
    const contract = new Contract(
      daiContractConfig.address,
      daiContractConfig.abi,
      getProvider()!,
    );
    return await contract.totalSupply();
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
