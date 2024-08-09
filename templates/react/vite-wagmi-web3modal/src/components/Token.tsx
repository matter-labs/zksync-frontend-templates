import { useState } from 'react'
import { type UseReadContractParameters, useReadContracts } from 'wagmi'
import { erc20Abi, formatUnits } from 'viem'
import { daiContractConfig } from './contracts'

export function Token() {
  const [address, setAddress] = useState<UseReadContractParameters['address']>(
    daiContractConfig.address,
  )
  const { data, error, isError, isLoading, refetch } = useReadContracts({ 
  allowFailure: false, 
  contracts: [ 
    { 
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', 
      abi: erc20Abi, 
      functionName: 'decimals', 
    }, 
    { 
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', 
      abi: erc20Abi, 
      functionName: 'name', 
    }, 
    { 
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', 
      abi: erc20Abi, 
      functionName: 'symbol', 
    }, 
    { 
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', 
      abi: erc20Abi, 
      functionName: 'totalSupply', 
    }, 
  ] 
})

const formattedSupply = data ? formatUnits(data[3], 18) : null
const symbol = data ? data[2] : null

  return (
    <>
      <div>
        <input
          onChange={(e) => setAddress(e.target.value as UseReadContractParameters['address'])}
          placeholder="token address"
          value={address}
        />
        <button onClick={() => refetch()}>fetch</button>
      </div>

      {data && (
        <div>
          {formattedSupply} {symbol}
        </div>
      )}
      {isLoading && <div>Fetching token...</div>}
      {isError && <div>Error: {error?.message}</div>}
    </>
  )
}
