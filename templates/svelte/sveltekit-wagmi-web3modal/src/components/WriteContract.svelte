<script lang="ts">
  import { useAsync } from "../composables/useAsync";
  import { daiContractConfig } from "../utils/contracts";
  import { stringify } from "../utils/formatters";
  import {
    writeContract as wagmiWriteContract,
    waitForTransaction,
  } from "@wagmi/core";

  let amount: string | null = null;

  const { state: transactionState, execute: writeContract } = useAsync(
    async () => {
      // random address for testing, replace with contract address that you want to allow to spend your tokens
      const spender = "0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044";

      const result = await wagmiWriteContract({
        ...daiContractConfig,
        functionName: "approve",
        args: [spender, BigInt(amount!)],
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
  <h3>Approve allowance</h3>
  <form on:submit|preventDefault={writeContract}>
    <input bind:value={amount} type="number" placeholder="allowance amount" />
    <button type="submit">Approve</button>
  </form>

  {#if inProgress}
    <div>Transaction pending...</div>
  {:else if transaction}
    <div>Transaction Hash: {transaction?.hash}</div>
    <div>
      Transaction Receipt:
      {#if receiptInProgress}
        <span>pending...</span>
      {/if}
      <pre>{stringify(receipt, null, 2)}</pre>
    </div>
  {/if}

  {#if error}
    <div>Error: {error?.message}</div>
  {/if}
  {#if receiptError}
    <div>Receipt Error: {receiptError?.message}</div>
  {/if}
</div>
