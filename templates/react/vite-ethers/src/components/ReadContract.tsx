'use client'

import { useState, useEffect } from 'react';
import { Contract } from 'zksync-ethers';

import { useAsync } from '../hooks/useAsync';
import { useEthereum } from './Context';
import { daiContractConfig } from './contracts'

export function ReadContract() {
  return (
    <div>
      <div>
        <BalanceOf />
        <br />
        <TotalSupply />
      </div>
    </div>
  )
}

function TotalSupply() {
  const { getProvider } = useEthereum();
  const {
    result: supply,
    execute: fetchTotalSupply,
    inProgress,
    error,
  } = useAsync(async () => {
    const provider = getProvider();
    if (!provider) throw new Error("Provider is not available");

    const contract = new Contract(daiContractConfig.address, daiContractConfig.abi, provider);
    return await contract.totalSupply();
  });

  useEffect(() => {
    fetchTotalSupply();
  }, []);

  return (
    <div>
      <div>
        Total Supply: {supply?.toString()}
        <button onClick={fetchTotalSupply}>
          {inProgress ? 'fetching...' : 'refetch'}
        </button>
      </div>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}

function BalanceOf() {
  const { getProvider } = useEthereum();
  const { account } = useEthereum();

  const [address, setAddress] = useState(account.address);

  const {
    result: balance,
    execute: fetchBalance,
    inProgress,
    error
  } = useAsync(async () => {
    const contract = new Contract(daiContractConfig.address, daiContractConfig.abi, getProvider()!);
    return contract.balanceOf(address);
  });

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div>
      <div>
        Token balance: {balance?.toString()}
      </div>
      <div>
        <input
          value={address!}
          onChange={(e) => setAddress(e.target.value)}
          type="text"
          placeholder="wallet address"
        />
        <button onClick={fetchBalance}>
          {inProgress ? 'fetching...' : 'refetch'}
        </button>
      </div>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
