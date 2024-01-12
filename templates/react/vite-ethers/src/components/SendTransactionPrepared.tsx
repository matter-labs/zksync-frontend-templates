'use client'

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import { useAsync } from '../hooks/useAsync';
import { useEthereum } from './Context';

export function SendTransactionPrepared() {
  const { getSigner, getProvider } = useEthereum();
  
  const [address, setAddress] = useState<string | null>(null);
  const [value, setValue] = useState<string | null>(null);
  
  const { result: preparedTransaction, execute: prepareTransaction, inProgress: prepareInProgress, error: prepareError } = useAsync(async () => {
    if (!address || !value) return;

    const transaction = {
      to: address,
      value: ethers.parseEther(value),
    };
    const gasPrice = await getProvider()!.getGasPrice();
    const gasLimit = await (await getSigner())!.estimateGas({
      ...transaction,
      gasPrice,
    });

    return {
      ...transaction,
      gasPrice,
      gasLimit,
    };
  });

  const { result: transaction, execute: sendTransaction, inProgress, error } = useAsync(async () => {
    const result = await (await getSigner())!.sendTransaction(preparedTransaction!);
    waitForReceipt(result.hash);
    return result;
  });

  const { result: receipt, execute: waitForReceipt, inProgress: receiptInProgress, error: receiptError } = useAsync(async (transactionHash: string) => {
    return await getProvider()!.waitForTransaction(transactionHash);
  });

  useEffect(() => {
    if (address && value) {
      prepareTransaction();
    }
  }, [address, value]);

  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault();
        sendTransaction();
      }}>
        <input value={address || ""} onChange={e => setAddress(e.target.value)} placeholder="address" />
        <input value={value || ""} onChange={e => setValue(e.target.value)} placeholder="value (ether)" />
        <button disabled={prepareInProgress || !preparedTransaction} type="submit">Send</button>
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

      {prepareError && <div>Preparing Transaction Error: {prepareError?.message}</div>}
      {error && <div>Error: {error?.message}</div>}
      {receiptError && <div>Receipt Error: {receiptError?.message}</div>}
    </div>
  );
}
