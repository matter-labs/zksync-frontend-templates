<script lang="ts">
  import { daiContractConfig } from "../utils/contracts";
  import { useAsync } from "../composables/useAsync";
  import { stringify } from "../utils/formatters";
  import {
    prepareWriteContract as wagmiPrepareWriteContract,
    writeContract as wagmiWriteContract,
    waitForTransaction,
  } from "@wagmi/core";

  let amount: string | null = null;

  // Preparing the transaction
  const { state: preparedTransactionState, execute: prepareTransaction } =
    useAsync(async () => {
      // random address for testing, replace with contract address that you want to allow to spend your tokens
      const spender = "0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044";

      return await wagmiPrepareWriteContract({
        ...daiContractConfig,
        functionName: "approve",
        args: [spender, BigInt(amount!)],
      });
    });
  $: ({
    result: preparedWriteContract,
    inProgress: prepareInProgress,
    error: prepareError,
  } = $preparedTransactionState);

  const { state: transactionState, execute: sendTransaction } = useAsync(
    async () => {
      const result = await wagmiWriteContract(preparedWriteContract!);
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

  $: amount && prepareTransaction();
</script>

<div>
  <form on:submit|preventDefault={sendTransaction}>
    <input bind:value={amount} type="number" placeholder="allowance amount" />
    <button disabled={prepareInProgress || !preparedWriteContract} type="submit"
      >Approve</button
    >
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

  {#if prepareError}
    <div>Preparing Transaction Error: {prepareError?.message}</div>
  {/if}
  {#if error}
    <div>Error: {error?.message}</div>
  {/if}
  {#if receiptError}
    <div>Receipt Error: {receiptError?.message}</div>
  {/if}
</div>
