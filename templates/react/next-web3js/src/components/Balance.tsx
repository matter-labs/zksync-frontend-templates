'use client'

import { useState, useEffect } from 'react';
import { fromWei } from 'web3-utils';

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
  const { account, getZKsync } = useEthereum();
  const { result: balance, execute: fetchBalance, error } = useAsync(address => getZKsync()!.L2.eth.getBalance(address));

  useEffect(() => {
    if (account?.address) {
      fetchBalance(account.address);
    }
  }, [account]);

  return (
    <div>
      <div>
        Connected wallet balance:
        {balance ? fromWei(balance, "ether") : ""}
        <button onClick={() => fetchBalance(account?.address)}>refetch</button>
      </div>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}

export function FindBalance() {
  const [address, setAddress] = useState('');
  const { getZKsync } = useEthereum();
  
  const fetchBalanceFunc = async (address: string) => {
    const zkSync = getZKsync();
    if (!zkSync) throw new Error("Provider not found");
    return zkSync.L2.eth.getBalance(address);
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
      <div>{balance ? fromWei(balance, "ether") : ""}</div>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
