<script lang="ts">
  import { writable } from 'svelte/store';
  import { BaseError } from 'viem';
  import { simulateContract, writeContract as wagmiWriteContract, waitForTransactionReceipt } from '@wagmi/core';
  import { get } from 'svelte/store';
  import { daiContractConfig } from '../utils/contracts';
  import { wagmiConfig } from '../wagmi';

  let amount = writable<string>('');
  let isSimulating = writable(false);
  let isPending = writable(false);
  let transactionHash = writable<string | null>(null);
  let receipt = writable<any>(null);
  let simulateError = writable<Error | null>(null);
  let error = writable<Error | null>(null);

  // random address for testing, replace with contract address that you want to allow to spend your tokens
  const spender: `0x${string}` = '0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044';


  const handleSubmit = async () => {
    const amountValue = get(amount);
    if (!amountValue) return;

    simulateError.set(null);
    error.set(null);
    
    try {
      isSimulating.set(true);

      const simulation = await simulateContract(wagmiConfig, {
        abi: daiContractConfig.abi,
        address: daiContractConfig.address,
        functionName: 'approve',
        args: [spender, BigInt(amountValue)],
      });

      isSimulating.set(false);

      if (simulation.result) {
        isPending.set(true);
        
        const result = await wagmiWriteContract(wagmiConfig, {
          abi: daiContractConfig.abi,
          address: daiContractConfig.address,
          functionName: 'approve',
          args: [spender, BigInt(amountValue)],
        });

        transactionHash.set(result);

        const transactionReceipt = await waitForTransactionReceipt(wagmiConfig, { hash: result });
        receipt.set(transactionReceipt);
      }
    } catch (e: any) {
      if (get(isSimulating)) {
        simulateError.set(e instanceof BaseError ? e : null);
      } else {
        error.set(e instanceof BaseError ? e : null);
      }
    } finally {
      isSimulating.set(false);
      isPending.set(false);
    }
  };
</script>

<form on:submit|preventDefault={handleSubmit}>
  <input bind:value={$amount} type="number" placeholder="Allowance Amount" />
  <button disabled={$isSimulating || $isPending || !$amount} type="submit">
    {$isSimulating ? 'Simulating...' : $isPending ? 'Confirming...' : 'Approve'}
  </button>
</form>

<div>
  {#if $simulateError}
    Simulation Error: {$simulateError.message}
  {/if}
  {#if $isPending}
    Check wallet...
  {/if}
  {#if $transactionHash}
    <div>Transaction Hash: {$transactionHash}</div>
    {#if $receipt}
      <div>
        Transaction Receipt: <pre>{JSON.stringify($receipt, null, 2)}</pre>
      </div>
    {/if}
  {/if}
  {#if $error}
    Error: {$error.message}
  {/if}
</div>
