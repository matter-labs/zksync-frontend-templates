import { BaseError } from 'viem'
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi'

import { usdcContractConfig } from './contracts'
import { stringify } from '../utils/stringify'

export function WriteContract() {
  const { address } = useAccount()
  const { write, data, error, isLoading, isError } = useContractWrite({
    ...usdcContractConfig,
    functionName: 'approve',
  })
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
          const formData = new FormData(e.target as HTMLFormElement)
          const amount = formData.get('amount') as string
          write({
            args: [address!, BigInt(amount)],
          })
        }}
      >
        <input name="amount" type="number" placeholder="allowance amount" />
        <button disabled={isLoading} type="submit">
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
