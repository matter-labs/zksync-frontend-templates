'use client';

import { useState, useEffect, useCallback } from 'react';
import { Contract } from 'zksync-ethers';
import { useAsync } from '../hooks/useAsync';
import { useEthereum } from './Context';
import { daiContractConfig } from './contracts';

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
  const { getProvider } = useEthereum();

  const fetchTotalSupply = useCallback(async () => {
    const provider = getProvider();
    if (!provider) throw new Error("Provider is not available");

    const contract = new Contract(daiContractConfig.address, daiContractConfig.abi, provider);
    return await contract.totalSupply();
  }, [getProvider]);

  const { result: supply, execute, inProgress, error } = useAsync(fetchTotalSupply);

  useEffect(() => {
    execute();
  }, [execute]);

  return (
    <div>
      <div>
        Total Supply: {supply?.toString()}
        <button onClick={execute}>
          {inProgress ? 'fetching...' : 'refetch'}
        </button>
      </div>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}

function BalanceOf() {
  const { getProvider, account } = useEthereum();
  const [address, setAddress] = useState(account.address);

  const fetchBalance = useCallback(async () => {
    const contract = new Contract(daiContractConfig.address, daiContractConfig.abi, getProvider()!);
    return contract.balanceOf(address);
  }, [getProvider, address]);

  const { result: balance, execute, inProgress, error } = useAsync(fetchBalance);

  useEffect(() => {
    execute();
  }, [execute]);

  return (
    <div>
      <div>
        Token balance: {balance?.toString()}
      </div>
      <div>
        <input
          value={address ?? ''}
          onChange={(e) => setAddress(e.target.value)}
          type="text"
          placeholder="wallet address"
        />
        <button onClick={execute}>
          {inProgress ? 'fetching...' : 'refetch'}
        </button>
      </div>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
