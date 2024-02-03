'use client'

import React, { useState } from 'react';
import { parseEther } from 'viem'
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'

import { stringify } from '../utils/stringify'

export function SendTransaction() {
  const { sendTransactionAsync, error: sendError, isError: isSendError } = useSendTransaction()
  const [transactionHash, setTransactionHash] = useState<string | undefined>(undefined);

  const {
    data: receipt,
    isError: isReceiptError,
    error: receiptError,
    isSuccess,
  } = useWaitForTransactionReceipt({ hash: transactionHash as `0x${string}` | undefined })

  async function handleSendTransaction(e: any) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const address = formData.get('address') as string
    const value = formData.get('value') as `${number}`
    
    const transactionResponse = await sendTransactionAsync({
      to: address as `0x${string}`,
      value: parseEther(value),
    })

    if (typeof transactionResponse !== 'undefined') {
      setTransactionHash(transactionResponse);
    }
  }

  return (
    <>
      <form onSubmit={handleSendTransaction}>
        <input name="address" placeholder="address" />
        <input name="value" placeholder="value (ether)" />
        <button type="submit">Send</button>
      </form>

      {isSendError && <div>Error: {sendError?.message}</div>}
      {!transactionHash && <div>Preparing transaction...</div>}
      {transactionHash && !isSuccess && <div>Transaction pending...</div>}
      {isSuccess && (
        <>
          <div>Transaction Hash: {transactionHash}</div>
          <div>
            Transaction Receipt: <pre>{stringify(receipt, null, 2)}</pre>
          </div>
        </>
      )}
      {isReceiptError && <div>Error: {receiptError?.message}</div>}
    </>
  )
}