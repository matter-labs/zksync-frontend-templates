'use client'

import { useState } from 'react';
import { Contract } from 'zksync-ethers';

import { useAsync } from '../hooks/useAsync';
import { daiContractConfig } from './contracts'
import { useEthereum } from './Context';

export function WriteContract() {
  const [amount, setAmount] = useState('');
  const { getSigner, getProvider } = useEthereum();
  const { result: transaction, execute: writeContract, inProgress, error } = useAsync(async () => {
    const contract = new Contract(daiContractConfig.address, daiContractConfig.abi, await getSigner());

    // random address for testing, replace with contract address that you want to allow to spend your tokens
    const spender = "0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044"
  
    const tx = await contract.approve(spender, amount);

    waitForReceipt(tx.hash);
    return tx;
  });

  const { result: receipt, execute: waitForReceipt, inProgress: receiptInProgress, error: receiptError } = useAsync(async (transactionHash) => {
    return await getProvider()!.waitForTransaction(transactionHash);
  });

  return (
    <div>
      <h3>Approve allowance</h3>
      <form onSubmit={(e) => { e.preventDefault(); writeContract(); }}>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          placeholder="allowance amount"
        />
        <button type="submit">Approve</button>
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
