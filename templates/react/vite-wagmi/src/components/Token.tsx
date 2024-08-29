import { useState } from 'react';
import { useReadContracts } from 'wagmi';
import { Address, erc20Abi, formatUnits } from 'viem';
import { daiContractConfig } from './contracts';

export function Token() {
  const [address, setAddress] = useState<Address>(daiContractConfig.address);

  const { data, error, isError, isLoading, refetch } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: address,
        abi: erc20Abi,
        functionName: 'decimals',
      },
      {
        address: address,
        abi: erc20Abi,
        functionName: 'name',
      },
      {
        address: address,
        abi: erc20Abi,
        functionName: 'symbol',
      },
      {
        address: address,
        abi: erc20Abi,
        functionName: 'totalSupply',
      },
    ],
  });

  const tokenData = data
    ? {
        symbol: data[2] as string,
        name: data[1] as string,
        decimals: (data[0]).toString(),
        supply: formatUnits(data[3] as bigint, data[0] as number),
      }
    : null;

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          refetch();
        }}
      >
        <input
          onChange={(e) => setAddress(e.target.value as Address)}
          placeholder="token address"
          value={address}
        />
        <button type="submit">fetch</button>
      </form>

      {isLoading ? (
        <div>Fetching token...</div>
      ) : tokenData ? (
        <pre>{JSON.stringify(tokenData, null, 4)}</pre>
      ) : isError ? (
        <div>Error: {error?.message}</div>
      ) : null}
    </div>
  );
}
