'use client'

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import { useAsync } from '../hooks/useAsync';
import { useEthereum } from './Context';

export function Balance() {
  return (
    <>
      <div>
        <AccountBalance />
      </div>
      <br />
      <div>
        <FindBalance />
      </div>
    </>
  )
}

export function AccountBalance() {
  const { getProvider, account } = useEthereum();
  const { result: balance, execute: fetchBalance, error } = useAsync(address => getProvider()!.getBalance(address));

  useEffect(() => {
    if (account?.address) {
      fetchBalance(account.address);
    }
  }, [account]);

  return (
    <div>
      <div>
        Connected wallet balance:
        {balance ? ethers.formatEther(balance) : ""}
        <button onClick={() => fetchBalance(account?.address)}>refetch</button>
      </div>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}

export function FindBalance() {
  const [address, setAddress] = useState('');
  const { getProvider } = useEthereum();
  
  const fetchBalanceFunc = async (address: string) => {
    const provider = getProvider();
    if (!provider) throw new Error("Provider not found");
    return provider.getBalance(address);
  };

  const { result: balance, execute: fetchBalance, inProgress, error } = useAsync(fetchBalanceFunc);

  return (
    <div>
      <div>
        Find balance:
        <input 
          value={address} 
          onChange={(e) => setAddress(e.target.value)} 
          type="text" 
          placeholder="wallet address"
        />
        <button onClick={() => fetchBalance(address)}>
          {inProgress ? 'fetching...' : 'fetch'}
        </button>
      </div>
      <div>{balance ? ethers.formatEther(balance) : ""}</div>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
