'use client'

import { useAsync } from '../hooks/useAsync';
import { chains, useEthereum } from './Context';

export function NetworkSwitcher() {
  const { switchNetwork: switchToChainByID, network } = useEthereum();
  const { execute: switchNetwork, error } = useAsync(switchToChainByID);

  return (
    <div>
      <div>
        Connected to {network?.name || network?.id}
        {network?.unsupported && <span>(unsupported)</span>}
      </div>
      <br />
      <div>
        Switch to:
        {chains.map((item, index) => (
          <button key={index} onClick={() => switchNetwork(item.id)}>
            {item.name}
          </button>
        ))}
      </div>

      {error && <div>Error: {error.message}</div>}
    </div>
  )
}
