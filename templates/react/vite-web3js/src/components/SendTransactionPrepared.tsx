import { FormEvent, useCallback, useEffect, useState } from 'react';
import { toWei } from 'web3-utils';
import { useEthereum } from '@/services/ethereum/context.ts';
import { useAsync } from '@/hooks/use-async.ts';

export function SendTransactionPrepared() {
  const { account, getZKsync } = useEthereum();
  const zkSync = getZKsync();

  const [address, setAddress] = useState<string | null>(null);
  const [value, setValue] = useState<string | null>(null);

  const asyncPrepareFetch = useCallback(async () => {
    if (!zkSync || !address || !value) throw new Error('Provider, address or value not found!');

    const transaction = {
      to: address,
      value: toWei(value, 'ether'),
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
  }, [account.address, address, value, zkSync]);

  const {
    result: preparedTransaction,
    execute: prepareTransaction,
    inProgress: prepareInProgress,
    error: prepareError,
  } = useAsync(asyncPrepareFetch);

  const asyncSendFetch = useCallback(async () => {
    if (!zkSync || !preparedTransaction) throw new Error('Provider not found or empty transaction!');

    return zkSync.L2.eth.sendTransaction(preparedTransaction);
  }, [preparedTransaction, zkSync]);

  const {
    result: transaction,
    execute: sendTransaction,
    inProgress,
    error,
  } = useAsync(asyncSendFetch);

  useEffect(() => {
    if (address && value) {
      void prepareTransaction();
    }
  }, [address, prepareTransaction, value]);

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
          value={address || ''}
          onChange={(e) => setAddress(e.target.value)}
          placeholder='address'
        />{' '}
        <input
          value={value || ''}
          onChange={(e) => setValue(e.target.value)}
          placeholder='value (ether)'
        />{' '}
        <button disabled={prepareInProgress || !preparedTransaction} type='submit'>
          Send
        </button>
      </form>

      {inProgress && <div>Transaction pending...</div>}
      {transaction && (
        <div>
          <div>Transaction Hash: {transaction?.blockHash}</div>
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

      {prepareError && <div>Preparing Transaction Error: {prepareError?.message}</div>}
      {error && <div>Error: {error?.message}</div>}
    </div>
  );
}
