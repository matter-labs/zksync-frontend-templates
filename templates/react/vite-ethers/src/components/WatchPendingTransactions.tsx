'use client'

import { useEffect, useState } from 'react';

import { useEthereum } from './Context';

export function WatchPendingTransactions() {
  const { getProvider } = useEthereum();
  const [transactionHashes, setTransactionHashes] = useState<string[]>([]);

  useEffect(() => {
    const provider = getProvider();

    const onBlock = async (blockNumber: number) => {
      const block = await provider?.getBlock(blockNumber);
      if (block && block.transactions) {
        setTransactionHashes(prevHashes => [...prevHashes, ...block.transactions]);
      }
    };

    if (provider) {
      provider.on("block", onBlock);
    }

    return () => {
      if (provider) {
        provider.off("block", onBlock);
      }
    };
  }, []);

  return (
    <div>
      <details>
        <summary>{transactionHashes.length} transaction hashes</summary>
        
        <pre>{[...transactionHashes].reverse().join('\n')}</pre>
      </details>
    </div>
  );
}
