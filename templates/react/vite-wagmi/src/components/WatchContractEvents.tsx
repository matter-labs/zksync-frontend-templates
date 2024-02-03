'use client'

import { useState } from 'react'
import type { Abi, Log } from 'viem'
import { useWatchContractEvent } from 'wagmi'

import { daiContractConfig } from './contracts'
import { stringify } from '../utils/stringify'

export function WatchContractEvents() {
  const [transferLogs, setTransferLog] = useState<Log[]>([])
  useWatchContractEvent({
    ...daiContractConfig,
    eventName: 'Transfer',
    listener: (logs) => setTransferLog((x) => [...x, ...logs]),
  } as {
    address?: `0x${string}` | `0x${string}`[] | undefined;
    abi?: readonly unknown[] | Abi | undefined;
    args?: {} | undefined;
    eventName?: string | undefined;
    onError?: ((error: Error) => void) | undefined;
    listener?: (logs: Log[]) => void;
    enabled?: boolean | undefined;
  })

  return (
    <div>
      <details>
        <summary>{transferLogs.length} DAI `Transfer`s logged</summary>
        {transferLogs
          .reverse()
          .map((log) => stringify(log))
          .join('\n\n\n\n')}
      </details>
    </div>
  )
}