import { FormEvent, useCallback, useState } from 'react';
import { useEthereum } from '@/services/ethereum/context.ts';
import { useAsync } from '@/hooks/use-async.ts';
import { daiContractConfig } from '@/services/contracts.ts';

export function WriteContract() {
  const { getWeb3, account } = useEthereum();
  const web3 = getWeb3();

  const [amount, setAmount] = useState('');

  const asyncFetch = useCallback(async () => {
    if (!web3) throw new Error('Provider not found');

    const contract = new web3.eth.Contract(daiContractConfig.abi, daiContractConfig.address);

    // random address for testing, replace with contract address that you want to allow to spend your tokens
    const spender = '0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044';

    const receipt = await contract.methods
      .approve(spender, amount)
      .send({ from: account.address as string });
    return {
      transactionHash: receipt.transactionHash,
      receipt,
    };
  }, [account.address, amount, web3]);

  const { result: transaction, execute: writeContract, inProgress, error } = useAsync(asyncFetch);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      void writeContract();
    },
    [writeContract]
  );

  return (
    <div>
      <h3>Approve allowance</h3>
      <form onSubmit={handleSubmit}>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type='number'
          placeholder='allowance amount'
        />
        <button type='submit'>Approve</button>
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
