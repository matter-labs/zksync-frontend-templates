import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { useEthereum } from '@/services/ethereum/context.ts';
import { daiContractConfig } from '@/services/contracts.ts';
import { useAsync } from '@/hooks/use-async.ts';

export function WriteContractPrepared() {
  const { getWeb3, account } = useEthereum();
  const web3 = getWeb3();

  const [amount, setAmount] = useState<string | null>(null);

  const getContractInstance = useCallback(async () => {
    if (!web3) throw new Error('Provider not found');
    return web3.zkSync.erc20(daiContractConfig.address);
  }, [web3]);

  const asyncPrepareFetch = useCallback(async () => {
    const contract = await getContractInstance();

    // random address for testing, replace with contract address that you want to allow to spend your tokens
    const spender = '0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044';

    if (!web3 || !spender) throw new Error('Provider not found');

    const gasPrice = await web3.eth.getGasPrice();

    const gasLimit = await contract.methods
      .approve(spender, amount)
      .estimateGas({ from: account.address as string });

    return {
      args: [spender, amount],
      overrides: {
        gasPrice,
        gasLimit,
      },
    };
  }, [account.address, amount, getContractInstance, web3]);

  const {
    result: preparedTransaction,
    execute: prepareTransaction,
    inProgress: prepareInProgress,
    error: prepareError,
  } = useAsync(asyncPrepareFetch);

  const asyncSendFetch = useCallback(async () => {
    const contract = await getContractInstance();
    if (!contract) return;

    const result = await contract.methods
      .approve(...preparedTransaction!.args, preparedTransaction!.overrides)
      .send({ from: account.address as string });

    return { transactionHash: result.transactionHash, receipt: result };
  }, [account.address, getContractInstance, preparedTransaction]);

  const {
    result: transaction,
    execute: sendTransaction,
    inProgress,
    error,
  } = useAsync(asyncSendFetch);

  useEffect(() => {
    if (!amount) return;

    void prepareTransaction();
  }, [amount, prepareTransaction]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      void sendTransaction();
    },
    [sendTransaction]
  );

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={amount ?? ''}
          onChange={(e) => setAmount(e.target.value)}
          type='number'
          placeholder='allowance amount'
        />
        <button disabled={prepareInProgress || !preparedTransaction} type='submit'>
          Approve
        </button>
      </form>

      {inProgress && <div>Transaction pending...</div>}

      {transaction && (
        <div>
          <div>Transaction Hash: {transaction?.transactionHash}</div>
          {inProgress ? (
            <span>pending...</span>
          ) : (
            <div style={{ maxWidth: 300 }}>
              Transaction Receipt:
              <pre>{JSON.stringify(transaction, null, 2)}</pre>
            </div>
          )}
        </div>
      )}

      {prepareError && <div>Preparing Transaction Error: {prepareError.message}</div>}
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
