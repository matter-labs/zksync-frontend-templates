'use client'

import { useState } from 'react'
import { BaseError } from 'viem'
import { useReadContract, useAccount } from 'wagmi'
import { type UseReadContractParameters } from 'wagmi'
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
  const { data, isRefetching, refetch } = useReadContract({
    ...daiContractConfig,
    functionName: 'totalSupply',
  })

  return (
    <div>
      Total Supply: {data?.toString()}
      <button
        disabled={isRefetching}
        onClick={() => refetch()}
        style={{ marginLeft: 4 }}
      >
        {isRefetching ? 'loading...' : 'refetch'}
      </button>
    </div>
  )
}

function BalanceOf() {
  const { address: connectedWalletAddress } = useAccount();
  const [address, setAddress] = useState<UseReadContractParameters['address']>(
    connectedWalletAddress!
  )
  const { data, error, isLoading, isSuccess } = useReadContract({
    ...daiContractConfig,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
  })

  const [value, setValue] = useState<string>(address as `0x${string}`)

  return (
    <div>
      Token balance: {isSuccess && data?.toString()}
      <input
        onChange={(e) => setValue(e.target.value)}
        placeholder="wallet address"
        style={{ marginLeft: 4 }}
        value={value}
      />
      <button onClick={() => setAddress(value as UseReadContractParameters['address'])}>
        {isLoading ? 'fetching...' : 'fetch'}
      </button>
      {error && <div>{(error as BaseError).shortMessage}</div>}
    </div>
  )
}