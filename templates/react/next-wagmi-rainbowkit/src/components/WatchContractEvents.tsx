'use client'

import { useState } from 'react'
import type { Log } from 'viem'
import { useContractEvent } from 'wagmi'

import { usdcContractConfig } from './contracts'
import { stringify } from '../utils/stringify'

export function WatchContractEvents() {
  const [usdcLogs, setUsdcLogs] = useState<Log[]>([])
  useContractEvent({
    ...usdcContractConfig,
    eventName: 'Transfer',
    listener: (logs) => setUsdcLogs((x) => [...x, ...logs]),
  })

  return (
    <div>
      <details>
        <summary>{usdcLogs.length} USDC `Transfer`s logged</summary>
        {usdcLogs
          .reverse()
          .map((log) => stringify(log))
          .join('\n\n\n\n')}
      </details>
    </div>
  )
}
