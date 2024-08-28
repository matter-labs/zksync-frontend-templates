import { useState, useEffect } from 'react';
import type { Transaction } from 'web3';
import { useEthereum } from '@/services/ethereum/context.ts';
import { daiContractConfig } from '@/services/contracts.ts';

export function WatchContractEvents() {
  const { getZKsync } = useEthereum();
  const [events, setEvents] = useState<Transaction[]>([]);

  useEffect(() => {
    const zkSync = getZKsync();
    if (!zkSync) return;

    const contract = new zkSync.L2.eth.Contract(daiContractConfig.abi, daiContractConfig.address);
    const transferEvent = contract.events.Transfer();

    transferEvent.on('data', (event) => {
      const { from, to, value } = event.returnValues;

      setEvents((prevEvents) => [
        ...prevEvents,
        { from: from as string, to: to as string, value: BigInt(value as number) },
      ]);
    });

    return () => {
      transferEvent.off('data', (event) => {
        const { from, to, value } = event.returnValues;

        setEvents((prevEvents) => [
          ...prevEvents,
          { from: from as string, to: to as string, value: BigInt(value as number) },
        ]);
      });
    };
  }, [getZKsync]);

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
