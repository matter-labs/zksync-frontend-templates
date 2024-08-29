'use client'

import { useEffect, useState } from 'react';
import { useEthereum } from './Context';

export function WatchPendingTransactions() {
  const { getZKsync } = useEthereum();
  const [transactionHashes, setTransactionHashes] = useState<string[]>([]);

  useEffect(() => {
    const zkSync = getZKsync();
    if (!zkSync) return;


    const onBlock = async () => {
      if (!zkSync)
      return;
      const blockSubscription = await zkSync.L2.eth.subscribe("newHeads");

      blockSubscription.on("data", (block) => {
        console.log(block);
        if (block && block.hash) {
          setTransactionHashes(prevHashes => [...prevHashes, block.hash as unknown as string]);
        }
      });
      return blockSubscription.off("data", (block) => {
        if (block && block.hash) {
          setTransactionHashes(prevHashes => [...prevHashes, block.hash as unknown as string]);
        }
    });
    };
    onBlock();
    
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
