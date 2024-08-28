<script lang="ts">
  import { switchChain } from "@wagmi/core";
  import { wagmiConfig, wagmiStore } from "../wagmi";
  import { get } from "svelte/store";
  import { useAsync } from "../composables/useAsync";
  import type { Chain } from "viem";

  $: ({ account } = get(wagmiStore));

  const chains: readonly Chain[] = wagmiConfig.chains;

  const { execute: switchNetwork, state: asyncState } = useAsync(switchChain);
  $: ({ inProgress, error } = $asyncState);

  const handleSwitchNetwork = async (chainId: number) => {
    if (account.isConnected) {
      try {
        await switchNetwork(wagmiConfig, { chainId });
      } catch (err) {
        console.error("Error switching network:", err);
      }
    }
  };

  $: currentChain = chains.find((chain) => chain.id === account.chainId) || null;
</script>

<div>
  <div>
    Connected to {currentChain?.name ?? currentChain?.id}
  </div>
  <br />
  <div>
    Switch to:
    {#each chains as item (item.id)}
      <button
        on:click={() => handleSwitchNetwork(item.id)}
        disabled={!account.isConnected || currentChain?.id === item.id}
      >
        {item.name}
      </button>
    {/each}
  </div>
  {#if error}
    <div>Error: {error?.message}</div>
  {/if}
</div>
