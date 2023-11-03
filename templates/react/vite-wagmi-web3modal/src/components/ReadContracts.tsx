import { useAccount, useContractReads } from 'wagmi'

import { usdcContractConfig } from './contracts'
import { stringify } from '../utils/stringify'

export function ReadContracts() {
  const { address } = useAccount();
  const { data, isSuccess, isLoading } = useContractReads({
    contracts: [
      {
        ...usdcContractConfig,
        functionName: 'balanceOf',
        args: [address!],
      },
      {
        ...usdcContractConfig,
        functionName: 'name',
      },
      {
        ...usdcContractConfig,
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
