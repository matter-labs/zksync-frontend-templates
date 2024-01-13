'use client'

import { useState } from 'react';
import { Contract } from 'zksync-ethers';

import { useAsync } from '../hooks/useAsync';
import { erc20ABI, daiContractConfig } from './contracts'
import { useEthereum } from './Context';

export function Token() {
  const { getProvider } = useEthereum();
  const [tokenAddress, setTokenAddress] = useState<string>(daiContractConfig.address);

  const fetchTokenData = async (address: string) => {
    const contract = new Contract(address, erc20ABI, getProvider()!);
    const [symbol, name, decimals, supply] = await Promise.all([
      contract.symbol(),
      contract.name(),
      contract.decimals(),
      contract.totalSupply(),
    ]);
    return {
      symbol,
      name,
      decimals,
      supply,
    };
  };

  const { result: token, execute: fetchToken, inProgress, error } = useAsync(fetchTokenData);
  const fetchCurrentToken = () => fetchToken(tokenAddress);

  return (
    <div>
      <form onSubmit={(e) => { e.preventDefault(); fetchCurrentToken(); }}>
        <input
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          placeholder="token address"
        />
        <button type="submit">fetch</button>
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
