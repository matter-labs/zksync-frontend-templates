'use client'

import { useAccount, useContractReads } from 'wagmi'

import { daiContractConfig } from './contracts'
import { stringify } from '../utils/stringify'

export function ReadContracts() {
  const { address } = useAccount();
  const { data, isSuccess, isLoading } = useContractReads({
    contracts: [
      {
        ...daiContractConfig,
        functionName: 'balanceOf',
        args: [address!],
      },
      {
        ...daiContractConfig,
        functionName: 'name',
      },
      {
        ...daiContractConfig,
        functionName: 'totalSupply',
      },
    ],
  })

  return (
    <div>
      <div>Data:</div>
      {isLoading && <div>loading...</div>}
      {isSuccess &&
        data?.map((data) => <pre key={stringify(data)}>{stringify(data)}</pre>)}
    </div>
  )
}
