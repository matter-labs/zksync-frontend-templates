<script lang="ts">
  import { parseEther, type Address } from "viem";
  import { useAsync } from "../composables/useAsync";
  import { stringify } from "../utils/formatters";
  import {
    sendTransaction as wagmiSendTransaction,
    waitForTransactionReceipt,
  } from "@wagmi/core";
  import { wagmiConfig } from "../wagmi";
  import { get, writable } from 'svelte/store';

  let address = writable<string>("");
  let value = writable<string>("");

  const { state: transactionState, execute: sendTransaction } = useAsync(async () => {
    const addressValue = get(address);
    if (addressValue.startsWith("0x")) {
      const result = await wagmiSendTransaction(wagmiConfig, {
        to: addressValue as Address,
        value: parseEther(get(value)),
      });
      waitForReceipt(result);
      return result;
    } else {
      throw new Error("Invalid address format");
    }
  });

  $: ({ result: transaction, inProgress, error } = $transactionState);

  const { state: receiptState, execute: waitForReceipt } = useAsync(async (transactionHash) => {
    return await waitForTransactionReceipt(wagmiConfig, { hash: transactionHash });
  });

  $: ({
    result: receipt,
    inProgress: receiptInProgress,
    error: receiptError,
  } = $receiptState);
</script>

<div>
  <form on:submit|preventDefault={sendTransaction}>
    <input bind:value={$address} placeholder="address" />
    <input bind:value={$value} placeholder="value (ether)" />
    <button type="submit">Send</button>
  </form>

  {#if inProgress}
    <div>Transaction pending...</div>
  {:else if transaction}
    <div>
      <div>Transaction Hash: {transaction}</div>
      <div>
        Transaction Receipt:
        {#if receiptInProgress}
          <span>pending...</span>
        {/if}
        <pre>{stringify(receipt, null, 2)}</pre>
      </div>
    </div>
  {/if}

  {#if error}
    <div>Error: {error?.message}</div>
  {/if}
  {#if receiptError}
    <div>Receipt Error: {receiptError?.message}</div>
  {/if}
</div>
