'use client'

import { useState } from 'react'
import type { Log } from 'viem'
import { useContractEvent } from 'wagmi'

import { daiContractConfig } from './contracts'
import { stringify } from '../utils/stringify'

export function WatchContractEvents() {
  const [transferLogs, setTransferLog] = useState<Log[]>([])
  useContractEvent({
    ...daiContractConfig,
    eventName: 'Transfer',
    listener: (logs) => setTransferLog((x) => [...x, ...logs]),
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
