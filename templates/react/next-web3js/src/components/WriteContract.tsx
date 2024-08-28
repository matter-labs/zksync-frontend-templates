'use client'

import { useState } from 'react';

import { useAsync } from '../hooks/useAsync';
import { daiContractConfig } from './contracts'
import { useEthereum } from './Context';

export function WriteContract() {
  const [amount, setAmount] = useState('');
  const { account, getZKsync } = useEthereum();
  const zkSync = getZKsync();
  const { result: transaction, execute: writeContract, inProgress, error } = useAsync(async () => {
    if (!zkSync) return;

    

    const contract = new zkSync.L2.eth.Contract(daiContractConfig.abi, daiContractConfig.address);

    // random address for testing, replace with contract address that you want to allow to spend your tokens
    const spender = "0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044"
  
    const receipt = await contract.methods.approve(spender, amount).send({from: account.address as string});
    return { 
      transactionHash: receipt.transactionHash,
      receipt
    };
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
          <div>Transaction Hash: {transaction?.transactionHash}</div>
          <div>
            Transaction Receipt:
            {transaction.receipt ? (
              <span>pending...</span>
            ) : (
              <pre>{JSON.stringify(transaction.receipt, null, 2)}</pre>
            )}
          </div>
        </div>
      )}

      {error && <div>Error: {error?.message}</div>}
    </div>
  );
}
