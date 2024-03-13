<script lang="ts">
  import { Contract } from "zksync-ethers";
  import { daiContractConfig, erc20ABI } from "../utils/contracts";
  import { etherStore } from "../stores/ethers";
  import { useAsync } from "../composables/useAsync";
  import { stringify } from "../utils/formatters";

  const { getProvider } = etherStore;

  let tokenAddress = daiContractConfig.address;

  const { state, execute: fetchToken } = useAsync(async (address: string) => {
    const contract = new Contract(address, erc20ABI, getProvider()!);
    const [symbol, name, decimals, supply] = await Promise.all([
      contract.symbol(),
      contract.name(),
      contract.decimals(),
      contract.totalSupply(),
    ]);
    return {
      symbol,
      name,
      decimals,
      supply,
    };
  });
  $: ({ result: token, inProgress, error } = $state);
  const fetchCurrentToken = () => fetchToken(tokenAddress);
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
