<script lang="ts">
  import { ethers } from "ethers";
  import { stringify } from "../utils/formatters";
  import { etherStore } from "../ethers";
  import { useAsync } from "../composables/useAsync";

  const { getSigner, getProvider } = etherStore;

  let address: string | null = "";
  let value: string | null = "";

  const { state: preparedTransactionState, execute: prepareTransaction } =
    useAsync(async () => {
      const transaction = {
        to: address!,
        value: ethers.parseEther(value!),
      };
      const gasPrice = await getProvider()!.getGasPrice();
      const gasLimit = await (await getSigner())!.estimateGas({
        to: address!,
        value: ethers.parseEther(value!),
        gasPrice,
      });

      return {
        ...transaction,
        gasPrice,
        gasLimit,
      };
    });
  $: ({
    result: preparedTransaction,
    inProgress: prepareInProgress,
    error: prepareError,
  } = $preparedTransactionState);

  const { state: transactionState, execute: sendTransaction } = useAsync(
    async () => {
      const result = await (await getSigner())!.sendTransaction(
        preparedTransaction!,
      );
      waitForReceipt(result.hash);
      return result;
    },
  );
  $: ({ result: transaction, inProgress, error } = $transactionState);

  const { state: receiptState, execute: waitForReceipt } = useAsync(
    async (transactionHash) => {
      return await getProvider()!.waitForTransaction(transactionHash);
    },
  );
  $: ({
    result: receipt,
    inProgress: receiptInProgress,
    error: receiptError,
  } = $receiptState);

  $: address && value && prepareTransaction();
</script>

<div>
  <form on:submit|preventDefault={sendTransaction}>
    <input bind:value={address} placeholder="address" />
    <input bind:value placeholder="value (ether)" />
    <button disabled={prepareInProgress || !preparedTransaction} type="submit"
      >Send</button
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
