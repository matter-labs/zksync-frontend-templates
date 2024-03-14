<script lang="ts">
  import { Contract } from "zksync-ethers";
  import { useAsync } from "../composables/useAsync";
  import { etherStore } from "../stores/ethers";
  import { daiContractConfig } from "../utils/contracts";
  import { onMount } from "svelte";

  const { getProvider } = etherStore;
  $: ({ account } = $etherStore);

  let { execute: fetchBalance, state } = useAsync(async () => {
    const contract = new Contract(
      daiContractConfig.address,
      daiContractConfig.abi,
      getProvider()!,
    );

    return contract.balanceOf(account.address!);
  });
  $: ({ inProgress, error, result: balance } = $state);

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
