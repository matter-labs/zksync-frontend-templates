'use client'

import { useState, useEffect } from 'react';

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

  const { getZKsync } = useEthereum();
  const {
    result: supply,
    execute: fetchTotalSupply,
    inProgress,
    error,
  } = useAsync(async () => {
    const zkSync = getZKsync();
    if (zkSync)
    {
      const contract = new zkSync.L2.eth.Contract( daiContractConfig.abi, daiContractConfig.address);
      const totalSupply = await contract.methods.totalSupply().call()
      return totalSupply;
    }
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
  const { account, getZKsync } = useEthereum();

  const [address, setAddress] = useState(account.address);

  const {
    result: balance,
    execute: fetchBalance,
    inProgress,
    error
  } = useAsync(async () => {
    const zkSync = getZKsync();
    if (zkSync)
    {
      const contract = new zkSync.L2.eth.Contract( daiContractConfig.abi, daiContractConfig.address);
      const b = await contract.methods.balanceOf(address).call();
      return b

    }
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
