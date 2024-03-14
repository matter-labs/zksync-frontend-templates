<script lang="ts">
  import { etherStore } from "../stores/ethers";

  const { connect, disconnect } = etherStore;
  $: ({ account } = $etherStore);
</script>

<div>
  {#if account.isConnected}
    <button on:click={disconnect}> Disconnect wallet </button>
  {:else}
    <button on:click={connect}> Connect wallet </button>
  {/if}
</div>
