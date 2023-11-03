'use client'

import { useState } from 'react'
import { BaseError } from 'viem'
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'

import { usdcContractConfig } from './contracts'
import { useDebounce } from '../hooks/useDebounce'
import { stringify } from '../utils/stringify'

export function WriteContractPrepared() {
  const { address } = useAccount()
  const [amount, setAmount] = useState('')
  const debouncedAmount = useDebounce(amount)

  const { config } = usePrepareContractWrite({
    ...usdcContractConfig,
    functionName: 'approve',
    enabled: Boolean(debouncedAmount),
    args: [address!, BigInt(debouncedAmount)],
  })
  const { write, data, error, isLoading, isError } = useContractWrite(config)
  const {
    data: receipt,
    isLoading: isPending,
    isSuccess,
  } = useWaitForTransaction({ hash: data?.hash })

  return (
    <>
      <h3>Approve allowance</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          write?.()
        }}
      >
        <input
          placeholder="allowance amount"
          type="number"
          onChange={(e) => setAmount(e.target.value)}
        />
        <button disabled={!write} type="submit">
          Approve
        </button>
      </form>

      {isLoading && <div>Check wallet...</div>}
      {isPending && <div>Transaction pending...</div>}
      {isSuccess && (
        <>
          <div>Transaction Hash: {data?.hash}</div>
          <div>
            Transaction Receipt: <pre>{stringify(receipt, null, 2)}</pre>
          </div>
        </>
      )}
      {isError && <div>{(error as BaseError)?.shortMessage}</div>}
    </>
  )
}
