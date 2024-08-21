<script lang="ts">
  import { ethers } from "ethers";
  import { stringify } from "../utils/formatters";
  import { etherStore } from "../ethers";
  import { useAsync } from "../composables/useAsync";

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

        const gasPrice = await getProvider()!.getGasPrice();
        const gasLimit = await signer.estimateGas({
          to: address!,
          value: ethers.parseEther(value!),
          gasPrice,
        });

        const result = await signer.sendTransaction({
          to: address!,
          value: ethers.parseEther(value!),
          gasPrice,
          gasLimit,
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
