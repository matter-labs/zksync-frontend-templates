'use client'

import { useState, useEffect } from 'react';
import { Contract } from 'zksync-ethers';

import { daiContractConfig } from './contracts'
import { useEthereum } from './Context';

type TransferLog = {
  from: string;
  to: string;
  amount: BigInt;
};

export function WatchContractEvents() {
  const { getProvider } = useEthereum();
  const [events, setEvents] = useState<TransferLog[]>([]);

  useEffect(() => {
    const provider = getProvider();
    if (!provider) return;

    const contract = new Contract(daiContractConfig.address, daiContractConfig.abi, provider);
    const handleTransfer = (from: string, to: string, amount: BigInt) => {
      setEvents(prevEvents => [...prevEvents, { from, to, amount }]);
    };
    
    contract.on('Transfer', handleTransfer);
    
    return () => {
      contract.off('Transfer', handleTransfer);
    };
  }, []);

  const logs = events
    .slice()
    .reverse()
    .map((log) => JSON.stringify(log, null, 2))
    .join('\n\n\n\n');

  return (
    <div>
      <details>
        <summary>{events.length} DAI `Transfer`s logged</summary>
        <pre>{logs}</pre>
      </details>
    </div>
  );
}
