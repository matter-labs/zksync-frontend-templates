'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function Connect() {
  const { connector, isConnected } = useAccount()
  const { connect, connectors, error } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <div>
      {isConnected && (
        <button onClick={() => disconnect()}>
          Disconnect from {connector?.name}
        </button>
      )}

      {connectors
        .filter((x) => x.id !== connector?.id)
        .map((x) => (
          <button key={x.id} onClick={() => connect({ connector: x })}>
            {x.name}
          </button>
        ))}

      {error && <div>{error.message}</div>}
    </div>
  )
}
