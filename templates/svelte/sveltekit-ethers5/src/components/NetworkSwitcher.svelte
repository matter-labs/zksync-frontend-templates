<script lang="ts" setup>
  import { etherStore, chains } from "../stores/ethers";
  import { useAsync } from "../composables/useAsync";

  const { switchNetwork: switchToChainByID } = etherStore;
  $: ({ network } = $etherStore);

  const { execute: switchNetwork, state: asyncState } =
    useAsync(switchToChainByID);
  $: ({ inProgress, error } = $asyncState);
</script>

<div>
  <div>
    Connected to {network?.name ?? network?.id}
    {#if network?.unsupported}
      <span>(unsupported)</span>
    {/if}
  </div>
  <br />
  <div>
    Switch to:
    {#each chains as item (item.id)}
      <button on:click={() => switchNetwork(item.id)}>
        {item.name}
      </button>
    {/each}
  </div>
  {#if error}
    <div>Error: {error?.message}</div>
  {/if}
</div>
