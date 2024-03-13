<script lang="ts" setup>
  import { readContracts } from "@wagmi/core";
  import { wagmiStore } from "../stores/wagmi";
  import { useAsync } from "../composables/useAsync";
  import { daiContractConfig } from "../utils/contracts";
  import { stringify } from "viem";
  import { onMount } from "svelte";

  $: ({ account } = $wagmiStore);

  const { state: asyncState, execute: fetchContracts } = useAsync(async () => {
    return await readContracts({
      contracts: [
        {
          ...daiContractConfig,
          functionName: "balanceOf",
          args: [account.address!],
        },
        {
          ...daiContractConfig,
          functionName: "name",
        },
        {
          ...daiContractConfig,
          functionName: "totalSupply",
        },
      ],
    });
  });

  $: ({ inProgress, error, result: results } = $asyncState);

  onMount(fetchContracts);
</script>

<div>
  <div>Data:</div>
  {#if inProgress}
    <div>loading...</div>
  {/if}

  {#if results}
    <div>
      {#each results as item (item)}
        <pre>{stringify(item)}</pre>
      {/each}
    </div>
  {/if}

  {#if error}
    <div>Error: {error?.message}</div>
  {/if}
</div>
