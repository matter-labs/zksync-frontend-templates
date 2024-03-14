<script lang="ts">
  import { wagmiStore } from "../wagmi";
  import { connect, disconnect, getConfig } from "@wagmi/core";

  const config = getConfig();
  $: ({ account } = $wagmiStore);
</script>

<div>
  {#if account.isConnected}
    <button on:click={disconnect}>
      Disconnect from {account.connector?.name}
    </button>
  {:else}
    {#each config.connectors as item (item.id)}
      <button on:click={() => connect({ connector: item })}>
        {item.name}
      </button>
    {/each}
  {/if}
</div>
