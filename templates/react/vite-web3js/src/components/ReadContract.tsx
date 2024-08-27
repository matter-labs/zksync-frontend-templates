import { useCallback, useEffect, useState } from 'react';
import { useEthereum } from '@/services/ethereum/context.ts';
import { daiContractConfig } from '@/services/contracts.ts';
import { useAsync } from '@/hooks/use-async.ts';

export function ReadContract() {
  return (
    <div>
      <div>
        <BalanceOf />
        <br />
        <TotalSupply />
      </div>
    </div>
  );
}

function TotalSupply() {
  const { getWeb3 } = useEthereum();

  const asyncFetch = useCallback(async () => {
    const web3 = getWeb3();

    if (!web3) throw new Error('Provider not found!');

    const contract = new web3.ZKsync.L2.eth.Contract(daiContractConfig.abi, daiContractConfig.address);
    return await contract.methods.totalSupply().call();
  }, [getWeb3]);

  const { result: supply, execute: fetchTotalSupply, inProgress, error } = useAsync(asyncFetch);

  useEffect(() => {
    void fetchTotalSupply();
  }, [fetchTotalSupply]);

  return (
    <div>
      <div>
        Total Supply: {supply?.toString()}{' '}
        <button onClick={fetchTotalSupply}>{inProgress ? 'fetching...' : 'refetch'}</button>
      </div>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}

function BalanceOf() {
  const { getWeb3 } = useEthereum();
  const { account } = useEthereum();

  const [address, setAddress] = useState(account.address || '');

  const asyncFetch = useCallback(async () => {
    const web3 = getWeb3();
    if (!web3) throw new Error('Provider not found!');

    const contract = new web3.ZKsync.L2.eth.Contract(daiContractConfig.abi, daiContractConfig.address);
    return await contract.methods.balanceOf(address).call();
  }, [address, getWeb3]);

  const { result: balance, execute: fetchBalance, inProgress, error } = useAsync(asyncFetch);

  useEffect(() => {
    void fetchBalance();
  }, [fetchBalance]);

  return (
    <div>
      <div>Token balance: {balance?.toString()}</div>
      <div>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          type='text'
          placeholder='wallet address'
        />{' '}
        <button onClick={fetchBalance}>{inProgress ? 'fetching...' : 'refetch'}</button>
      </div>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
