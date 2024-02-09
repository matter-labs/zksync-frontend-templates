'use client'

import { useAccount, useSwitchChain } from 'wagmi'

export function NetworkSwitcher() {
  const { chain } = useAccount()
  const { chains, switchChain } = useSwitchChain()

  return (
    <div>
      <div>
        Connected to {chain?.name ?? chain?.id}
      </div>
      <br />
      {switchChain && (
        <div>
          Switch to:{' '}
          {chains.map((x) =>
            x.id === chain?.id ? null : (
              <button key={x.id} onClick={() => switchChain({ chainId: x.id })}>
                {x.name}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  )
}