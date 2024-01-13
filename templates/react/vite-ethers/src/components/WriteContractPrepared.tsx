'use client'

import { useState, useEffect } from 'react';
import { Contract } from 'zksync-ethers';

import { useAsync } from '../hooks/useAsync';
import { daiContractConfig } from './contracts';
import { useEthereum } from './Context';

export function WriteContractPrepared() {
  const [amount, setAmount] = useState<string | null>(null);
  const { getSigner, getProvider } = useEthereum();

  const getContractInstance = async () => {
    return new Contract(daiContractConfig.address, daiContractConfig.abi, await getSigner()!);
  }

  const { result: preparedTransaction, execute: prepareTransaction, inProgress: prepareInProgress, error: prepareError } = useAsync(async () => {
    const contract = await getContractInstance();
    
    // random address for testing, replace with contract address that you want to allow to spend your tokens
    const spender = "0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044"

    const gasPrice = await getProvider()!.getGasPrice();
    const gasLimit = await contract.getFunction("approve").estimateGas(spender, amount);

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
    const result = await contract.approve(...preparedTransaction!.args, preparedTransaction!.overrides);
    waitForReceipt(result.hash);
    return result;
  });

  const { result: receipt, execute: waitForReceipt, inProgress: receiptInProgress, error: receiptError } = useAsync(async (transactionHash) => {
    return await getProvider()!.waitForTransaction(transactionHash);
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
        )
      )}

      {prepareError && <div>Preparing Transaction Error: {prepareError.message}</div>}
      {error && <div>Error: {error.message}</div>}
      {receiptError && <div>Receipt Error: {receiptError.message}</div>}
    </div>
  );
}
