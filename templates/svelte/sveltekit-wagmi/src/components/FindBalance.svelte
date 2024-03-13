<script lang="ts" setup>
  import { useAsync } from "../composables/useAsync";
  import { fetchBalance as wagmiFetchBalance, type Address } from "@wagmi/core";

  const { state: asyncState, execute: fetchBalance } =
    useAsync(wagmiFetchBalance);
  $: ({ result: balance, error, inProgress } = $asyncState);

  let address: Address = "0x";
</script>

<div>
  <div>
    Find balance:
    <input bind:value={address} type="text" placeholder="wallet address" />
    <button on:click={() => fetchBalance({ address })}
      >{inProgress ? "fetching..." : "fetch"}</button
    >
  </div>
  <div>{balance?.formatted || ""}</div>
  {#if error}
    <div>Error: {error?.message}</div>
  {/if}
</div>
