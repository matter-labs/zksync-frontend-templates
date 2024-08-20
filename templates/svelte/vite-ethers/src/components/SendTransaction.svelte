<script lang="ts">
  import { ethers } from "ethers";
  import { etherStore } from "../ethers";
  import { useAsync } from "../composables/useAsync";
  import { stringify } from "../utils/formatters";

  const { getSigner, getProvider } = etherStore;

  let address: string | null = "";
  let value: string | null = "";

 const { state: transactionState, execute: sendTransaction } = useAsync(
  async () => {
    try {
      const signer = await getSigner();
      if (!signer) {
        throw new Error("Failed to get signer");
      }
      const result = await signer.sendTransaction({
        to: address!,
        value: ethers.parseEther(value!),
      });
      waitForReceipt(result.hash);
      return result;
    } catch (error) {
      console.error("Error sending transaction:", error);
      throw error;
    }
  }
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
</script>

<div>
  <form on:submit|preventDefault={sendTransaction}>
    <input bind:value={address} placeholder="address" />
    <input bind:value placeholder="value (ether)" />
    <button type="submit">Send</button>
  </form>

  <div>
  {#if inProgress}
    <div>Transaction pending...</div>
  {:else if transaction}
    <div>
      <div>Transaction Hash: {transaction?.hash}</div>
      <div>
        Transaction Receipt:
        {#if receiptInProgress}
          <span>pending...</span>
        {:else if receipt}
          <pre>{stringify(receipt, null, 2)}</pre>
        {:else}
          <div>No transaction receipt available</div>
        {/if}
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
</div>
