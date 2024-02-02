'use client'

import { useState } from 'react'
import { formatUnits } from 'viem' 
import { type UseBalanceParameters } from 'wagmi'
import { useAccount, useBalance } from 'wagmi'

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
  const { address } = useAccount()
  const { data, refetch } = useBalance({
    address,
  })

  const formattedBalance = data?.value && data?.decimals 
  ? formatUnits(data.value, data.decimals) 
  : 'Loading...';

  return (
    <div>
      {formattedBalance}
      <button onClick={() => refetch()}>refetch</button>
    </div>
  )
}

export function FindBalance() {
  const [address, setAddress] = useState('')
  const { data, isLoading, refetch } = useBalance({
    address: address as UseBalanceParameters['address'],
  })

  const [value, setValue] = useState('')

  const formattedBalance = data?.value && data?.decimals 
    ? formatUnits(data.value, data.decimals) 
    : 'Enter an address and click fetch';

  return (
    <div>
      Find balance:{' '}
      <input
        onChange={(e) => setValue(e.target.value)}
        placeholder="wallet address"
        value={value}
      />
      <button
        onClick={() => (value === address ? refetch() : setAddress(value))}
      >
        {isLoading ? 'fetching...' : 'fetch'}
      </button>
      <div>{formattedBalance}</div>
    </div>
  )
}
