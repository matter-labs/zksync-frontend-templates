'use client';

import React, { useState, useEffect } from 'react';
import { BaseError } from 'viem';
import { useWriteContract, useWaitForTransactionReceipt, useSimulateContract } from 'wagmi';

import { stringify } from '../utils/stringify'
import { daiContractConfig } from './contracts';
import { useDebounce } from '../hooks/useDebounce';

export function WriteContractPrepared() {
  const [amount, setAmount] = useState<string>('');
  const debouncedAmount = useDebounce(amount);
  const [simulationResult, setSimulationResult] = useState<boolean | null>(null);
  const [isSimulationPending, setIsSimulationPending] = useState(false);

  // Random address for testing, replace with the contract address that you want to allow to spend your tokens
  const spender = "0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044";

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: simulateData, error: simulateError, isLoading: isSimulating } = useSimulateContract({
    abi: daiContractConfig.abi,
    address: daiContractConfig.address,
    functionName: 'approve',
    args: [spender, BigInt(debouncedAmount || '0')],
  });

  useEffect(() => {
    setIsSimulationPending(false);
  }, [isSimulating, simulateData, simulateError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (debouncedAmount) {
      if (!simulateError) {
        if (simulateData) {
          setSimulationResult(simulateData.result);
        }
        writeContract({
          address: daiContractConfig.address,
          abi: daiContractConfig.abi,
          functionName: 'approve',
          args: [spender, BigInt(debouncedAmount)],
        });
      } else {
        console.error('Simulation error:', simulateError);
      }
    }
  };

  return (
    <>
      <h3>Approve Allowance</h3>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Allowance Amount"
          type="number"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
        />
        <button disabled={isPending || !amount || isSimulating || isSimulationPending} type="submit">
          {isSimulating ? 'Simulating...' : isPending ? 'Confirming...' : 'Approve'}
        </button>
      </form>
      {simulateError && <div>Simulation Error: {(simulateError as BaseError)?.message}</div>}
      {isPending && <div>Check wallet...</div>}
      {isConfirming && <div>Transaction pending...</div>}
      {isSuccess && receipt && (
        <>
          <div>Transaction Hash: {hash}</div>
          <div>Transaction Receipt: <pre>{stringify(receipt, null, 2)}</pre></div>
        </>
      )}
      {error && <div>Error: {(error as BaseError)?.message}</div>}
    </>
  );
}