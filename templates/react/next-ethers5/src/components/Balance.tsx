'use client';

import { useState, useEffect, useCallback } from 'react';
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
  );
}

export function AccountBalance() {
  const { getProvider, account } = useEthereum();

  const fetchBalance = useCallback((address: string) => {
    return getProvider()!.getBalance(address);
  }, [getProvider]);

  const { result: balance, execute, error } = useAsync(fetchBalance);

  useEffect(() => {
    if (account?.address) {
      execute(account.address);
    }
  }, [account, execute]);

  return (
    <div>
      <div>
        Connected wallet balance:
        {balance ? ethers.utils.formatEther(balance) : "0"}
        <button onClick={() => account?.address && execute(account?.address)}>refetch</button>
      </div>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}

export function FindBalance() {
  const [address, setAddress] = useState('');
  const { getProvider } = useEthereum();
  
  const fetchBalanceFunc = useCallback(async (address: string) => {
    const provider = getProvider();
    if (!provider) throw new Error("Provider not found");
    return provider.getBalance(address);
  }, [getProvider]);

  const { result: balance, execute, inProgress, error } = useAsync(fetchBalanceFunc);

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
        <button onClick={() => execute(address)} disabled={!address}>
          {inProgress ? 'fetching...' : 'fetch'}
        </button>
      </div>
      <div>{balance ? ethers.utils.formatEther(balance) : "0"}</div>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
