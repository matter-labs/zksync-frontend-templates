'use client';

import { useState, useCallback } from 'react';
import { ethers } from 'ethers';

import { useAsync } from '../hooks/useAsync';
import { useEthereum } from './Context';

export function SendTransactionPrepared() {
  const { getSigner, getProvider } = useEthereum();
  
  const [address, setAddress] = useState<string>('');
  const [value, setValue] = useState<string>('');

  const prepareTransaction = useCallback(async () => {
    if (!address || !value) return null;

    const signer = await getSigner();
    if (!signer) throw new Error("Signer not available");
    
    const provider = getProvider();
    if (!provider) throw new Error("Provider not available");

    const transaction = {
      to: address,
      value: ethers.utils.parseEther(value), 
    };

    const gasPrice = await provider.getGasPrice();
    console.log("Gas Price:", gasPrice.toString());

    const gasLimit = await signer.estimateGas({
      ...transaction,
      gasPrice,
    });
    console.log("Gas Limit:", gasLimit.toString());

    const preparedTransaction = {
      ...transaction,
      gasPrice,
      gasLimit,
    };
    console.log("Prepared Transaction:", preparedTransaction);

    return preparedTransaction;
  }, [address, value, getSigner, getProvider]);

  const { result: preparedTransaction, execute: executePrepareTransaction, inProgress: prepareInProgress, error: prepareError } = useAsync(prepareTransaction);

  const sendTransaction = useCallback(async () => {
    if (!preparedTransaction) return;
    const signer = await getSigner();
    if (!signer) throw new Error("Signer not available");

    const result = await signer.sendTransaction(preparedTransaction);
    return result;
  }, [preparedTransaction, getSigner]);

  const { result: transaction, execute: executeSendTransaction, inProgress: sendInProgress, error: sendError } = useAsync(sendTransaction);

  const { result: receipt, execute: waitForReceipt, inProgress: receiptInProgress, error: receiptError } = useAsync(async (transactionHash: string) => {
    const provider = getProvider();
    if (!provider) throw new Error("Provider not available");

    return await provider.waitForTransaction(transactionHash);
  });

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
        <input 
          value={address} 
          onChange={e => setAddress(e.target.value)} 
          placeholder="address" 
        />
        <input 
          value={value} 
          onChange={e => setValue(e.target.value)} 
          placeholder="value (ether)" 
        />
        <button disabled={prepareInProgress || sendInProgress || !address || !value} type="submit">Send</button>
      </form>

      {(prepareInProgress || sendInProgress) && <div>Transaction pending...</div>}
      {transaction && (
        <div>
          <div>Transaction Hash: {transaction.hash}</div>
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

      {prepareError && <div>Preparing Transaction Error: {prepareError.message}</div>}
      {sendError && <div>Sending Transaction Error: {sendError.message}</div>}
      {receiptError && <div>Receipt Error: {receiptError.message}</div>}
    </div>
  );
}
