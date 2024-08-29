'use client'

import { useState, useCallback, useEffect } from 'react';
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

  const fetchTotalSupply = useCallback(async () => {
    const provider = getProvider();
    if (!provider) throw new Error("Provider is not available");

    const contract = new Contract(daiContractConfig.address, daiContractConfig.abi, provider);
    return await contract.totalSupply();
  }, [getProvider]);

  const {
    result: supply,
    execute: executeFetchTotalSupply,
    inProgress,
    error,
  } = useAsync(fetchTotalSupply);

  useEffect(() => {
    executeFetchTotalSupply();
  }, [executeFetchTotalSupply]);

  return (
    <div>
      <div>
        Total Supply: {supply?.toString()}
        <button onClick={executeFetchTotalSupply} disabled={inProgress}>
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
    if (!address) throw new Error("Address is not set");
    const provider = getProvider();
    if (!provider) throw new Error("Provider is not available");

    const contract = new Contract(daiContractConfig.address, daiContractConfig.abi, provider);
    return await contract.balanceOf(address);
  }, [getProvider, address]);

  const {
    result: balance,
    execute: executeFetchBalance,
    inProgress,
    error
  } = useAsync(fetchBalance);

  useEffect(() => {
    executeFetchBalance();
  }, [executeFetchBalance]);

  const handleAddressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  }, []);

  const handleFetchBalance = useCallback(() => {
    executeFetchBalance();
  }, [executeFetchBalance]);

  return (
    <div>
      <div>
        Token balance: {balance?.toString()}
      </div>
      <div>
        <input
          value={address || ""}
          onChange={handleAddressChange}
          type="text"
          placeholder="wallet address"
        />
        <button onClick={handleFetchBalance} disabled={inProgress}>
          {inProgress ? 'fetching...' : 'refetch'}
        </button>
      </div>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
