'use client'

import { useState } from 'react';

import { useAsync } from '../hooks/useAsync';
import { ERC20TokenAbi, daiContractConfig } from './contracts'
import { useEthereum } from './Context';

export function Token() {
  const { getZKsync } = useEthereum();
  const [tokenAddress, setTokenAddress] = useState<string>(daiContractConfig.address);
  const zkSync = getZKsync();
  const fetchTokenData = async (address: string) => {
    if (!zkSync) {
      throw new Error('ZKsync not found');
    }
    const contract = new zkSync.L2.eth.Contract(ERC20TokenAbi, address);
    const [symbol, name, decimals, supply] = await Promise.all([
      contract.methods.symbol().call(),
      contract.methods.name().call(),
      contract.methods.decimals().call(),
      contract.methods.totalSupply().call,
    ]);
    return {
      symbol,
      name,
      decimals : decimals.toString(),
      supply: supply,
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
