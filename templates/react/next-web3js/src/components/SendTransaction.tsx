'use client'

import { useState } from 'react';
import { DEFAULT_RETURN_FORMAT } from 'web3';
import { useAsync } from '../hooks/useAsync';
import { useEthereum } from './Context';

export function SendTransaction() {
  const [address, setAddress] = useState<string | null>(null);
  const [value, setValue] = useState<string | null>(null);

  const { getWeb3, account } = useEthereum();

  const web3 = getWeb3();

  const { result: transaction, execute: sendTransaction, inProgress, error } = useAsync(async () => {
    if(web3 && value){
        console.log("Sending transaction to address: ", address, value);
        console.log(account)
        const result = await web3.eth.sendTransaction({
            to: address,
            value: web3.utils.toWei(value, 'ether'),
            from: account.address as string,
        }, DEFAULT_RETURN_FORMAT, { ignoreGasPricing: true, 
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
