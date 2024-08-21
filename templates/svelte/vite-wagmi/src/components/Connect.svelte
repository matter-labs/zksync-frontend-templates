<script lang="ts">
  import { wagmiConfig, wagmiStore } from "../wagmi";
  import { connect, disconnect, type Connector } from "@wagmi/core";

  $: ({ account } = $wagmiStore);

  const handleConnect = async (connector: Connector) => {
    await connect(wagmiConfig, { connector });
  };

  const handleDisconnect = async () => {
    await disconnect(wagmiConfig);
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
