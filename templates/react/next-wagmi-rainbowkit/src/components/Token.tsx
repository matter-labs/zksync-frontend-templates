'use client'

import { useState } from 'react'
import { type Address, useToken } from 'wagmi'
import { daiContractConfig } from './contracts'

export function Token() {
  const [address, setAddress] = useState<Address>(
    daiContractConfig.address,
  )
  const { data, error, isError, isLoading, refetch } = useToken({ address })

  return (
    <>
      <div>
        <input
          onChange={(e) => setAddress(e.target.value as Address)}
          placeholder="token address"
          value={address}
        />
        <button onClick={() => refetch()}>fetch</button>
      </div>

      {data && (
        <div>
          {data.totalSupply?.formatted} {data.symbol}
        </div>
      )}
      {isLoading && <div>Fetching token...</div>}
      {isError && <div>Error: {error?.message}</div>}
    </>
  )
}
