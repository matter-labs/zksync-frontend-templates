<script lang="ts" setup>
  import { ethers } from "ethers";
  import { useAsync } from "../composables/useAsync";
  import { etherStore } from "../stores/ethers";

  const { state: asyncState, execute: fetchBalance } = useAsync((address) =>
    etherStore.getProvider()!.getBalance(address),
  );
  $: ({ result: balance, error, inProgress } = $asyncState);

  let address = "";
</script>

<div>
  <div>
    Find balance:
    <input bind:value={address} type="text" placeholder="wallet address" />
    <button on:click={() => fetchBalance(address)}
      >{inProgress ? "fetching..." : "fetch"}</button
    >
  </div>
  <div>{balance ? ethers.formatEther(balance) : ""}</div>
  {#if error}
    <div>Error: {error?.message}</div>
  {/if}
</div>
