'use client'

import { BaseError } from 'viem'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

import { daiContractConfig } from './contracts'
import { stringify } from '../utils/stringify'

export function WriteContract() {
  // Random address for testing, replace with the contract address that you want to allow to spend your tokens
  const spender = "0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044";

  const { writeContract, data: hash, error, isPending } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: receipt,
  } = useWaitForTransactionReceipt({ hash })

  async function submit(e: any) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const amount = formData.get('amount') as string
    writeContract({
      address: daiContractConfig.address,
      abi: daiContractConfig.abi,
      functionName: 'approve',
      args: [spender, BigInt(amount)],
    })
  }

  return (
    <>
      <h3>Approve Allowance</h3>
      <form onSubmit={submit}>
        <input name="amount" type="number" placeholder="Allowance amount" />
        <button disabled={isPending} type="submit">
          Approve
        </button>
      </form>

      {isPending && <div>Check wallet...</div>}
      {isConfirming && <div>Transaction pending...</div>}
      {isConfirmed && (
        <>
          <div>Transaction Hash: {hash}</div>
          <div>
            Transaction Receipt: <pre>{stringify(receipt, null, 2)}</pre>
          </div>
        </>
      )}
      {error && <div>{(error as BaseError)?.shortMessage || error.message}</div>}
    </>
  )
}
