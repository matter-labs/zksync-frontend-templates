'use client'

import { useState, useCallback } from 'react';
import { Contract } from 'zksync-ethers';
import { useAsync } from '../hooks/useAsync';
import { daiContractConfig } from './contracts';
import { useEthereum } from './Context';

export function WriteContractPrepared() {
  const [amount, setAmount] = useState<string | null>(null);
  const { getSigner, getProvider } = useEthereum();

  const getContractInstance = useCallback(async () => {
    return new Contract(daiContractConfig.address, daiContractConfig.abi, await getSigner()!);
  }, [getSigner]);

  const prepareAndSendTransaction = useCallback(async () => {
    if (!amount) return null;

    const contract = await getContractInstance();
    
    // random address for testing, replace with contract address that you want to allow to spend your tokens
    const spender = "0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044"

    const gasPrice = await getProvider()!.getGasPrice();
    const gasLimit = await contract.getFunction("approve").estimateGas(spender, amount);

    const preparedTransaction = {
      args: [spender, amount],
      overrides: {
        gasPrice,
        gasLimit
      }
    };

    const result = await contract.approve(...preparedTransaction.args, preparedTransaction.overrides);
    return result;
  }, [amount, getContractInstance, getProvider]);

  const { result: transaction, execute: executePrepareAndSendTransaction, inProgress, error } = useAsync(prepareAndSendTransaction);

  const { result: receipt, execute: waitForReceipt, inProgress: receiptInProgress, error: receiptError } = useAsync(async (transactionHash: string) => {
    return await getProvider()!.waitForTransaction(transactionHash);
  });

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await executePrepareAndSendTransaction();
    if (result) {
      waitForReceipt(result.hash);
    }
  }, [executePrepareAndSendTransaction, waitForReceipt]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          value={amount ?? ""} 
          onChange={e => setAmount(e.target.value)} 
          type="number" 
          placeholder="allowance amount" 
        />
        <button disabled={inProgress || !amount} type="submit">Approve</button>
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

      {error && <div>Error: {error.message}</div>}
      {receiptError && <div>Receipt Error: {receiptError.message}</div>}
    </div>
  );
}
