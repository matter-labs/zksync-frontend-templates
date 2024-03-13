<script lang="ts">
  import { Contract } from "zksync-ethers";
  import { etherStore } from "../stores/ethers";
  import { daiContractConfig } from "../utils/contracts";
  import { useAsync } from "../composables/useAsync";
  import { stringify } from "../utils/formatters";

  const { getSigner, getProvider } = etherStore;
  let amount: string | null = null;

  const getContractInstance = async () => {
    return new Contract(
      daiContractConfig.address,
      daiContractConfig.abi,
      await getSigner()!,
    );
  };

  // Preparing the transaction
  const { state: preparedTransactionState, execute: prepareTransaction } =
    useAsync(async () => {
      const contract = await getContractInstance();

      // random address for testing, replace with contract address that you want to allow to spend your tokens
      const spender = "0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044";

      const gasPrice = await getProvider()!.getGasPrice();
      const gasLimit = await contract
        .getFunction("approve")
        .estimateGas(spender, amount);

      return {
        args: [spender, amount],
        overrides: {
          gasPrice,
          gasLimit,
        },
      };
    });
  $: ({
    result: preparedTransaction,
    inProgress: prepareInProgress,
    error: prepareError,
  } = $preparedTransactionState);

  const { state: transactionState, execute: sendTransaction } = useAsync(
    async () => {
      const contract = await getContractInstance();
      const transaction = preparedTransaction!;
      const result = await contract.approve(
        ...transaction.args,
        transaction.overrides,
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

  $: amount && prepareTransaction();
</script>

<div>
  <form on:submit|preventDefault={sendTransaction}>
    <input bind:value={amount} type="number" placeholder="allowance amount" />
    <button disabled={prepareInProgress || !preparedTransaction} type="submit"
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

  {#if prepareInProgress}
    <div>Preparing Transaction...</div>
  {:else if preparedTransaction}
    <div>
      Prepared Transaction: {stringify(preparedTransaction, null, 2)}
    </div>
  {/if}

  {#if error}
    <div>Error: {error?.message}</div>
  {/if}
  {#if receiptError}
    <div>Receipt Error: {receiptError?.message}</div>
  {/if}
</div>
