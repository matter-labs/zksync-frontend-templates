'use client'

import { useState } from 'react';
import { ethers } from 'ethers';

import { useAsync } from '../hooks/useAsync';
import { useEthereum } from './Context';

export function SendTransaction() {
  const [address, setAddress] = useState<string | null>(null);
  const [value, setValue] = useState<string | null>(null);

  const { getSigner, getProvider } = useEthereum();

  const { result: transaction, execute: sendTransaction, inProgress, error } = useAsync(async () => {
    const result = await (await getSigner())!.sendTransaction({
      to: address!,
      value: ethers.parseEther(value!),
    });
    waitForReceipt(result.hash);
    return result;
  });

  const { result: receipt, execute: waitForReceipt, inProgress: receiptInProgress, error: receiptError } = useAsync(async (transactionHash: string) => {
    return await getProvider()!.waitForTransaction(transactionHash);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendTransaction();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={address || ''} onChange={e => setAddress(e.target.value)} placeholder="address" />
        <input value={value || ''} onChange={e => setValue(e.target.value)} placeholder="value (ether)" />
        <button type="submit">Send</button>
      </form>

      {inProgress && <div>Transaction pending...</div>}
      {transaction && (
        <div>
          <div>Transaction Hash: {transaction.hash}</div>
          <div>
            Transaction Receipt:
            {receiptInProgress ? <span>pending...</span> : <pre>{JSON.stringify(receipt, null, 2)}</pre>}
          </div>
        </div>
      )}

      {error && <div>Error: {error.message}</div>}
      {receiptError && <div>Receipt Error: {receiptError.message}</div>}
    </div>
  );
}
