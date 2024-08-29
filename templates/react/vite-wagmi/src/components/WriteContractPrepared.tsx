import { useState, useEffect } from 'react';
import { BaseError } from 'viem';
import { useWriteContract, useWaitForTransactionReceipt, useSimulateContract } from 'wagmi';
import { stringify } from '../utils/stringify';
import { daiContractConfig } from './contracts';
import { useDebounce } from '../hooks/useDebounce';

export function WriteContractPrepared() {
  const [amount, setAmount] = useState<string>('');
  const debouncedAmount = useDebounce(amount);
  const [isSimulated, setIsSimulated] = useState(false);

  // Random address for testing, replace with the contract address that you want to allow to spend your tokens
  const spender = "0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044";

  const { writeContract, data: hash, error: writeError, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: simulateData, error: simulateError } = useSimulateContract({
    abi: daiContractConfig.abi,
    address: daiContractConfig.address,
    functionName: 'approve',
    args: [spender, BigInt(debouncedAmount || '0')],
  });

  useEffect(() => {
    if (debouncedAmount && simulateData && !simulateError && !isSimulated) {
      setIsSimulated(true);
      writeContract({
        address: daiContractConfig.address,
        abi: daiContractConfig.abi,
        functionName: 'approve',
        args: [spender, BigInt(debouncedAmount)],
      });
    }
  }, [debouncedAmount, simulateData, simulateError, isSimulated, writeContract]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSimulated(false);
  };

  const isDisabled = isPending || !amount || isConfirming;

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
        <button disabled={isDisabled} type="submit">
          {isPending || isConfirming ? 'Processing...' : 'Approve'}
        </button>
      </form>
      {simulateError && <div>Simulation Error: {(simulateError as BaseError)?.message}</div>}
      {writeError && <div>Write Error: {(writeError as BaseError)?.message}</div>}
      {(isPending || isConfirming) && <div>Transaction in progress...</div>}
      {isSuccess && receipt && (
        <>
          <div>Transaction Hash: {hash}</div>
          <div>Transaction Receipt: <pre>{stringify(receipt, null, 2)}</pre></div>
        </>
      )}
    </>
  );
}
