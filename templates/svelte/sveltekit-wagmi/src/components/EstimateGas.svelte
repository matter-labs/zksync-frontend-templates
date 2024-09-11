<script lang="ts">
  import { get, writable } from 'svelte/store';
  import { parseEther } from 'viem';
  import { estimateGas, sendTransaction, waitForTransactionReceipt } from '@wagmi/core';
  import { wagmiConfig } from "../stores/wagmi";

  let to = writable('');
  let value = writable('');
  let estimatedGas = writable<bigint | undefined>(undefined);
  let transactionHash = writable<string | undefined>(undefined);
  let isSending = writable(false);
  let isConfirming = writable(false);
  let isConfirmed = writable(false);
  let sendError = writable<Error | null>(null);
  let receiptError = writable<Error | null>(null);

  const handleSubmit = async () => {
    const toValue = get(to);
    const valueValue = get(value);

    if (toValue && valueValue) {
      isSending.set(true);
      try {
        const gasEstimate = await estimateGas(wagmiConfig, {
          to: toValue as `0x${string}`,
          value: parseEther(valueValue),
        });
        estimatedGas.set(gasEstimate);

        const hash = await sendTransaction(wagmiConfig, {
          to: toValue as `0x${string}`,
          value: parseEther(valueValue),
          gas: gasEstimate,
        });

        transactionHash.set(hash);

        isSending.set(false);
        isConfirming.set(true);
        await waitForTransactionReceipt(wagmiConfig, {
          hash: hash,
        });

        isConfirmed.set(true);
        isConfirming.set(false);
      } catch (error) {
        isSending.set(false);
        sendError.set(error as Error);
        console.error('Error estimating or sending transaction:', error);
      }
    }
  };
</script>

<form on:submit|preventDefault={handleSubmit}>
  <input
    bind:value={$to}
    placeholder="address"
    type="text"
  />
  <input
    bind:value={$value}
    placeholder="value (ether)"
    type="text"
  />
  <button disabled={$isSending || !$to || !$value} type="submit">
    {$isSending ? 'Confirming...' : 'Send'}
  </button>
</form>

<div>
  {#if $estimatedGas}
    Estimated Gas: {$estimatedGas}
  {/if}
  {#if $transactionHash}
    Transaction Hash: {$transactionHash}
  {/if}
  {#if $isConfirming}
    Waiting for confirmation...
  {/if}
  {#if $isConfirmed}
    Transaction confirmed.
  {/if}
  {#if $sendError || $receiptError}
    Error: {($sendError || $receiptError)?.message}
  {/if}
</div>
