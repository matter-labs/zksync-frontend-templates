<script lang="ts" setup>
  import { switchNetwork as wagmiSwitchNetwork } from "@wagmi/core";
  import { useAsync } from "../composables/useAsync";
  import { wagmiStore } from "../stores/wagmi";

  $: ({ network } = $wagmiStore);

  const { execute: switchNetwork, state: asyncState } =
    useAsync(wagmiSwitchNetwork);
  $: ({ inProgress, error } = $asyncState);
</script>

<div>
  <div>
    Connected to {network.chain?.name ?? network.chain?.id}
    {#if network.chain?.unsupported}
      <span>(unsupported)</span>
    {/if}
  </div>
  <br />
  <div>
    Switch to:
    {#each network.chains as item (item.id)}
      <button on:click={() => switchNetwork({ chainId: item.id })}>
        {item.name}
      </button>
    {/each}
  </div>
  {#if error}
    <div>Error: {error?.message}</div>
  {/if}
</div>
