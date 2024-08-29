'use client';

import { useState, useCallback, useEffect } from 'react';
import { Contract } from 'zksync-ethers';
import { useAsync } from '../hooks/useAsync';
import { daiContractConfig } from './contracts';
import { useEthereum } from './Context';

export function WriteContractPrepared() {
  const [amount, setAmount] = useState<string | null>(null);
  const { getSigner, getProvider } = useEthereum();

  const getContractInstance = useCallback(() => {
    const signer = getSigner();
    if (!signer) throw new Error("Signer not available");
    return new Contract(daiContractConfig.address, daiContractConfig.abi, signer);
  }, [getSigner]);

  const prepareTransaction = useCallback(async () => {
    const contract = getContractInstance();
    
    // random address for testing, replace with contract address that you want to allow to spend your tokens
    const spender = "0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044";

    const provider = getProvider();
    if (!provider) throw new Error("Provider not available");

    const gasPrice = await provider.getGasPrice();
    const gasLimit = await contract.estimateGas.approve(spender, amount);

    return {
      args: [spender, amount],
      overrides: {
        gasPrice,
        gasLimit
      }
    };
  }, [amount, getContractInstance, getProvider]);

  const { result: preparedTransaction, execute: executePrepareTransaction, inProgress: prepareInProgress, error: prepareError } = useAsync(prepareTransaction);

  const { result: receipt, execute: waitForReceipt, inProgress: receiptInProgress, error: receiptError } = useAsync(async (transactionHash: string) => {
    const provider = getProvider();
    if (!provider) throw new Error("Provider not available");

    return await provider.waitForTransaction(transactionHash);
  });

  const sendTransaction = useCallback(async () => {
    if (!preparedTransaction) throw new Error("Prepared transaction is not available");

    const contract = getContractInstance();
    const result = await contract.approve(...preparedTransaction.args, preparedTransaction.overrides);
    waitForReceipt(result.hash);
    return result;
  }, [getContractInstance, preparedTransaction, waitForReceipt]);

  const { result: transaction, execute: executeSendTransaction, inProgress, error } = useAsync(sendTransaction);

  useEffect(() => {
    if (!amount) return;
    executePrepareTransaction();
  }, [amount, executePrepareTransaction]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await executeSendTransaction();
    if (result) {
      waitForReceipt(result.hash);
    }
  }, [executeSendTransaction, waitForReceipt]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={amount ?? ""} onChange={e => setAmount(e.target.value)} type="number" placeholder="allowance amount" />
        <button disabled={prepareInProgress || !preparedTransaction} type="submit">Approve</button>
      </form>

      {inProgress ? (
        <div>Transaction pending...</div>
      ) : (
        transaction && (
          <div>
            <div>Transaction Hash: {transaction?.hash}</div>
            <div>
              Transaction Receipt:
              {receiptInProgress ? (
                <span>pending...</span>
              ) : (
                <pre>{JSON.stringify(receipt, null, 2)}</pre>
              )}
            </div>
          </div>
        )
      )}

      {prepareError && <div>Preparing Transaction Error: {prepareError.message}</div>}
      {error && <div>Error: {error.message}</div>}
      {receiptError && <div>Receipt Error: {receiptError.message}</div>}
    </div>
  );
}
