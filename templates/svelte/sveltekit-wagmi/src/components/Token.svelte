<script lang="ts">
  import { fetchToken as wagmiFetchToken } from "@wagmi/core";
  import { daiContractConfig } from "../utils/contracts";
  import { useAsync } from "../composables/useAsync";
  import { stringify } from "../utils/formatters";

  let tokenAddress = daiContractConfig.address;

  const { state, execute: fetchToken } = useAsync(wagmiFetchToken);
  $: ({ result: token, inProgress, error } = $state);
  const fetchCurrentToken = () => fetchToken({ address: tokenAddress });
</script>

<div>
  <form on:submit|preventDefault={fetchCurrentToken}>
    <input bind:value={tokenAddress} placeholder="token address" />
    <button type="submit">fetch</button>
  </form>
  {#if inProgress}
    <div>Fetching token...</div>
  {:else if token}
    <pre>{stringify(token, null, 4)}</pre>
  {:else if error}
    <div>Error: {error?.message}</div>
  {/if}
</div>
