import { FormEvent, useCallback, useState } from 'react';
import { useEthereum } from '@/services/ethereum/context.ts';
import { daiContractConfig } from '@/services/contracts.ts';
import { IERC20ABI } from 'web3-plugin-zksync/lib/contracts/IERC20';
import { useAsync } from '@/hooks/use-async.ts';

export function Token() {
  const { getZKsync } = useEthereum();
  const zkSync = getZKsync();

  const [tokenAddress, setTokenAddress] = useState<string>(daiContractConfig.address);

  const asyncFetch = useCallback(
    async (address: string) => {
      if (!zkSync) throw new Error('Web3 not found');

      const contract = new zkSync.L2.eth.Contract(IERC20ABI, address);
      const [symbol, name, decimals, supply] = await Promise.all([
        contract.methods.symbol().call(),
        contract.methods.name().call(),
        contract.methods.decimals().call(),
        contract.methods.totalSupply().call,
      ]);

      return {
        symbol,
        name,
        decimals: decimals.toString(),
        supply: supply,
      };
    },
    [zkSync]
  );

  const { result: token, execute: fetchToken, inProgress, error } = useAsync(asyncFetch);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      void fetchToken(tokenAddress);
    },
    [fetchToken, tokenAddress]
  );

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          placeholder='token address'
        />{' '}
        <button type='submit'>fetch</button>
      </form>
      {inProgress ? (
        <div>Fetching token...</div>
      ) : token ? (
        <pre>{JSON.stringify(token, null, 4)}</pre>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : null}
    </div>
  );
}
