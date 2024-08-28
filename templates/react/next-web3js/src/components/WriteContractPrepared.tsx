'use client'

import { useState, useEffect } from 'react';

import { useAsync } from '../hooks/useAsync';
import { daiContractConfig } from './contracts';
import { useEthereum } from './Context';

export function WriteContractPrepared() {
  const [amount, setAmount] = useState<string | null>(null);
  const { account, getZKsync } = useEthereum();
  const zkSync = getZKsync();
  const getContractInstance = async () => {
    if (!zkSync) return;
    return new zkSync.L2.eth.Contract(daiContractConfig.abi, daiContractConfig.address);
  }

  const { result: preparedTransaction, execute: prepareTransaction, inProgress: prepareInProgress, error: prepareError } = useAsync(async () => {
    const contract = await getContractInstance();
    
    // random address for testing, replace with contract address that you want to allow to spend your tokens
    const spender = "0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044"
    if (!zkSync) return;
    const gasPrice = await zkSync.L2.eth.getGasPrice();
    if (!contract) return;
    const gasLimit = await contract.methods.approve(spender, amount).estimateGas({from: account.address as string});

    return {
      args: [spender, amount],
      overrides: {
        gasPrice,
        gasLimit
      }
    };
  });

  const { result: transaction, execute: sendTransaction, inProgress, error } = useAsync(async () => {
    const contract = await getContractInstance();
    if (!contract) return;
    const result = await contract.methods.approve(...preparedTransaction!.args, preparedTransaction!.overrides).send({from: account.address as string});
    return {transactionHash: result.transactionHash,
      receipt: result};
  });

  useEffect(() => {
    if (!amount) return;
    prepareTransaction();
  }, [amount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendTransaction();
  };

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
            <div>Transaction Hash: {transaction?.transactionHash}</div>
            <div>
              Transaction Receipt:
              {transaction ? (
                <span>pending...</span>
              ) : (
                <pre>{JSON.stringify(transaction, null, 2)}</pre>
              )}
            </div>
          </div>
        )
      )}

      {prepareError && <div>Preparing Transaction Error: {prepareError.message}</div>}
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
