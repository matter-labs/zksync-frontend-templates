'use client'

import { useState, useEffect } from 'react';
import { toWei } from 'web3-utils';

import { useAsync } from '../hooks/useAsync';
import { useEthereum } from './Context';

export function SendTransactionPrepared() {
  const { account, getZKsync } = useEthereum();
  
  const [address, setAddress] = useState<string | null>(null);
  const [value, setValue] = useState<string | null>(null);
  const zkSync = getZKsync();
  const { result: preparedTransaction, execute: prepareTransaction, inProgress: prepareInProgress, error: prepareError } = useAsync(async () => {
    if (!address || !value) return;
    if (!zkSync) return;
    const transaction = {
      to: address,
      value: toWei(value, "ether"),
      from: account.address as string,
    };
    const gasPrice = await zkSync.L2.eth.getGasPrice();
    const gasLimit = await zkSync.L2.eth.estimateGas({
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
    if (!zkSync) return;
    if (!preparedTransaction) return;
    const result = await zkSync.L2.eth.sendTransaction(preparedTransaction);
    return result;
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
          <div>Transaction Hash: {transaction?.blockHash}</div>
          <div>
            Transaction Receipt:
            {transaction ? (
              <span>pending...</span>
            ) : (
              <pre>{JSON.stringify(transaction, null, 2)}</pre>
            )}
          </div>
        </div>
      )}

      {prepareError && <div>Preparing Transaction Error: {prepareError?.message}</div>}
      {error && <div>Error: {error?.message}</div>}
    </div>
  );
}
