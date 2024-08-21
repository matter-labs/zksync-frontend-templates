<script lang="ts">
  import { writable } from 'svelte/store';
  import { readContracts } from '@wagmi/core';
  import { erc20Abi } from "viem";
  import { get } from 'svelte/store';
  import { wagmiConfig } from '../wagmi';
  import { daiContractConfig } from '../utils/contracts';

  type TokenResult = [number, string, string, bigint];

  let tokenAddress = writable(daiContractConfig.address);
  let token = writable<TokenResult | null>(null); 
  let inProgress = writable(false);
  let error = writable<Error | null>(null);

  const fetchToken = async () => {
    inProgress.set(true);
    error.set(null);

    try {
      const result = await readContracts(wagmiConfig, {
        allowFailure: false, 
        contracts: [
          {
            address: get(tokenAddress), 
            abi: erc20Abi,
            functionName: 'decimals',
          },
          {
            address: get(tokenAddress), 
            abi: erc20Abi,
            functionName: 'name',
          },
          {
            address: get(tokenAddress), 
            abi: erc20Abi,
            functionName: 'symbol',
          },
          {
            address: get(tokenAddress), 
            abi: erc20Abi,
            functionName: 'totalSupply',
          },
        ],
      });

      token.set(result);
    } catch (err) {
      error.set(err as Error);
    } finally {
      inProgress.set(false);
    }
  };

  const fetchCurrentToken = () => {
    fetchToken();
  };
</script>

<form on:submit|preventDefault={fetchCurrentToken}>
  <input bind:value={$tokenAddress} placeholder="token address" />
  <button type="submit">fetch</button>
</form>

<div>
  {#if $inProgress}
    Fetching token...
  {:else if $token}
    <pre>{JSON.stringify($token, (key, value) => typeof value === 'bigint' ? value.toString() : value, 4)}</pre>
  {:else if $error}
    Error: {$error.message}
  {/if}
</div>
