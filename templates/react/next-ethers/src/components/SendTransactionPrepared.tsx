'use client'

import { useState, useCallback } from 'react';
import { ethers } from 'ethers';

import { useAsync } from '../hooks/useAsync';
import { useEthereum } from './Context';

export function SendTransactionPrepared() {
  const { getSigner, getProvider } = useEthereum();
  
  const [address, setAddress] = useState<string | null>(null);
  const [value, setValue] = useState<string | null>(null);

  const prepareAndSendTransaction = useCallback(async () => {
    if (!address || !value) return null;

    const signer = await getSigner();
    if (!signer) throw new Error("Signer not available");

    const transaction = {
      to: address,
      value: ethers.parseEther(value),
    };

    const gasPrice = await getProvider()!.getGasPrice();
    const gasLimit = await signer.estimateGas({
      ...transaction,
      gasPrice,
    });

    const preparedTransaction = {
      ...transaction,
      gasPrice,
      gasLimit,
    };

    const result = await signer.sendTransaction(preparedTransaction);
    return result;
  }, [address, value, getSigner, getProvider]);

  const { result: transaction, execute: executePrepareAndSendTransaction, inProgress, error } = useAsync(prepareAndSendTransaction);

  const { result: receipt, execute: waitForReceipt, inProgress: receiptInProgress, error: receiptError } = useAsync(async (transactionHash: string) => {
    return await getProvider()!.waitForTransaction(transactionHash);
  });

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await executePrepareAndSendTransaction();
    if (result) {
      waitForReceipt(result.hash);
    }
  }, [executePrepareAndSendTransaction, waitForReceipt]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          value={address || ""} 
          onChange={e => setAddress(e.target.value)} 
          placeholder="address" 
        />
        <input 
          value={value || ""} 
          onChange={e => setValue(e.target.value)} 
          placeholder="value (ether)" 
        />
        <button disabled={inProgress || !address || !value} type="submit">Send</button>
      </form>

      {inProgress && <div>Transaction pending...</div>}
      {transaction && (
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
      )}

      {error && <div>Error: {error?.message}</div>}
      {receiptError && <div>Receipt Error: {receiptError?.message}</div>}
    </div>
  );
}
