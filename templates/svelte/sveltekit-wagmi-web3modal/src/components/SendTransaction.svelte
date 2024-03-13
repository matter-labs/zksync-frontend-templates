<script lang="ts">
  import { parseEther } from "viem";
  import { useAsync } from "../composables/useAsync";
  import { stringify } from "../utils/formatters";
  import {
    type Address,
    sendTransaction as wagmiSendTransaction,
    waitForTransaction,
  } from "@wagmi/core";

  let address: Address | null = "0x";
  let value: string | null = "";

  const { state: transactionState, execute: sendTransaction } = useAsync(
    async () => {
      const result = await wagmiSendTransaction({
        to: address!,
        value: parseEther(value!),
      });
      waitForReceipt(result.hash);
      return result;
    }
  );
  $: ({ result: transaction, inProgress, error } = $transactionState);

  const { state: receiptState, execute: waitForReceipt } = useAsync(
    async (transactionHash) => {
      return await waitForTransaction({ hash: transactionHash });
    }
  );
  $: ({
    result: receipt,
    inProgress: receiptInProgress,
    error: receiptError,
  } = $receiptState);
</script>

<div>
  <form on:submit|preventDefault={sendTransaction}>
    <input bind:value={address} placeholder="address" />
    <input bind:value placeholder="value (ether)" />
    <button type="submit">Send</button>
  </form>

  {#if inProgress}
    <div>Transaction pending...</div>
  {:else if transaction}
    <div>
      <div>Transaction Hash: {transaction?.hash}</div>
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
