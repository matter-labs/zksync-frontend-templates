'use client'

import { FormEvent, useState } from 'react';
import { parseEther } from 'viem';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { estimateGas } from '@wagmi/core'
import { config } from '../wagmi'; 

export function EstimateGas() {
  const [to, setTo] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [estimatedGas, setEstimatedGas] = useState<bigint | undefined>(undefined);

  const { sendTransactionAsync, isPending: isSending, error: sendError } = useSendTransaction();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (to && value) {
      try {
        const gasEstimate = await estimateGas(config, {
          to: to as `0x${string}`,
          value: parseEther(value),
        });
        setEstimatedGas(gasEstimate);

        const hash = await sendTransactionAsync({
          to: to as `0x${string}`,
          value: parseEther(value),
          gas: gasEstimate,
        });
        if (typeof hash !== 'undefined') {
          setTransactionHash(hash);
        }
      } catch (error) {
        console.error('Error estimating or sending transaction:', error);
      }
    }
  };

  const [transactionHash, setTransactionHash] = useState<string | undefined>(undefined);
  const { isFetching: isConfirming, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({
    hash: transactionHash as `0x${string}` | undefined,
  });

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Address"
          onChange={(e) => setTo(e.currentTarget.value)}
          value={to}
        />
        <input
          placeholder="Value (ether)"
          onChange={(e) => setValue(e.currentTarget.value)}
          value={value}
        />
        <button disabled={isSending || !to || !value} type="submit">
          {isSending ? 'Confirming...' : 'Send'}
        </button>
      </form>

      {estimatedGas && <div>Estimated Gas: {estimatedGas.toString()}</div>}
      {transactionHash && <div>Transaction Hash: {transactionHash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}
      {(sendError || receiptError) && (
        <div>Error: {(sendError || receiptError)?.message}</div>
      )}
    </>
  );
}