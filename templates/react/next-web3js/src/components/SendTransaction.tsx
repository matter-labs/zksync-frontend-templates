'use client'

import { useState } from 'react';
import { FMT_BYTES, FMT_NUMBER } from 'web3-types';
import { toWei } from 'web3-utils';
import { useAsync } from '../hooks/useAsync';
import { useEthereum } from './Context';

export function SendTransaction() {
  const [address, setAddress] = useState<string | null>(null);
  const [value, setValue] = useState<string | null>(null);

  const { account, getZKsync } = useEthereum();

  const zkSync = getZKsync();

  const { result: transaction, execute: sendTransaction, inProgress, error } = useAsync(async () => {
    if(zkSync && value){
        const result = await zkSync.L2.eth.sendTransaction({
            to: address,
            value: toWei(value, 'ether'),
            from: account.address as string,
        }, { bytes: FMT_BYTES.HEX, number: FMT_NUMBER.STR }, { ignoreGasPricing: true, 
          checkRevertBeforeSending: false,});
        return result;   
    }
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
          <div>Transaction Hash: {transaction.blockHash}</div>
          <div>
            Transaction Receipt:
            {inProgress ? <span>pending...</span> : <pre>{JSON.stringify(transaction, null, 2)}</pre>}
          </div>
        </div>
      )}

      {error && <div>Error: {error.message}</div>}
    </div>
  )
}
