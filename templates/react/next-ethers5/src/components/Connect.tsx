'use client'

import { useEthereum } from './Context';

export function Connect() {
  const { account, connect, disconnect } = useEthereum();

  return (
    <div>
      {account.isConnected ? (
        <button onClick={disconnect}>
          Disconnect wallet
        </button>
      ) : (
        <button onClick={connect}>
          Connect wallet
        </button>
      )}
    </div>
  )
}
