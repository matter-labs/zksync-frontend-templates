'use client'

import { useState } from 'react'
import { recoverTypedDataAddress, Address } from 'viem'
import { useAccount, useSignTypedData } from 'wagmi'
import { defaultChain } from '../wagmi'

const domain = {
  name: 'Ether Mail',
  version: '1',
  chainId: defaultChain.id,
  verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
} as const

const types = {
  Person: [
    { name: 'name', type: 'string' },
    { name: 'wallet', type: 'address' },
  ],
  Mail: [
    { name: 'from', type: 'Person' },
    { name: 'to', type: 'Person' },
    { name: 'contents', type: 'string' },
  ],
} as const

const message = {
  from: {
    name: 'Cow',
    wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
  },
  to: {
    name: 'Bob',
    wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
  },
  contents: 'Hello, Bob!',
} as const

export function SignTypedData() {
  const { address } = useAccount()
  const { signTypedDataAsync } = useSignTypedData();
  const [recoveredAddress, setRecoveredAddress] = useState<Address>()
  const [error, setError] = useState<Error | null>(null)

  const handleSignMessage = async () => {
    try {
      const signature = await signTypedDataAsync({
        domain,
        types,
        message,
        primaryType: 'Mail',
      })
      const recovered = await recoverTypedDataAddress({
        domain,
        types,
        message,
        primaryType: 'Mail',
        signature,
      })
      setRecoveredAddress(recovered)
    } catch (error) {
      setError(error as Error)
    }
  }

  return (
    <>
      <button onClick={handleSignMessage}>
        Sign Message
      </button>

      {recoveredAddress && (
        <div>
          <div>Recovered address: {recoveredAddress}</div>
        </div>
      )}
      {error && <div>Error: {error.message}</div>}
    </>
  )
}
