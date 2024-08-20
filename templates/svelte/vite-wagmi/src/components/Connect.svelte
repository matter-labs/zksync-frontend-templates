<script lang="ts">
  import { wagmiConfig, wagmiStore } from "../wagmi";
  import { connect, disconnect, type Connector } from "@wagmi/core";
  import { get } from "svelte/store";

  $: ({ account } = get(wagmiStore));

  const handleConnect = async (connector: Connector) => {
    try {
      await connect(wagmiConfig, { connector });
    } catch (error) {
      console.error("Error connecting:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect(wagmiConfig);
      account.isConnected = false;
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };
</script>

<div>
  {#if account.isConnected}
    <button on:click={handleDisconnect}>
      Disconnect from {account.connector?.name}
    </button>
  {:else}
    {#each wagmiConfig.connectors as item (item.id)}
      <button on:click={() => handleConnect(item)}>
        Connect with {item.name}
      </button>
    {/each}
  {/if}
</div>
