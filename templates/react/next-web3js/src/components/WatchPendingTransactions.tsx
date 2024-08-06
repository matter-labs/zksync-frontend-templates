'use client'

import { useEffect, useState } from 'react';
import { useEthereum } from './Context';

export function WatchPendingTransactions() {
  const { getWeb3 } = useEthereum();
  const [transactionHashes, setTransactionHashes] = useState<string[]>([]);

  useEffect(() => {
    const web3 = getWeb3();
    if (!web3) return;


    const onBlock = async () => {
      if (!web3)
      return;
      const blockSubscription = await web3.eth.subscribe("newPendingTransactions");
      console.log("subscripbed");
      blockSubscription.on("data", (block) => {
        console.log(block);
        if (block  != undefined){
            setTransactionHashes(prevHashes => [...prevHashes, ...(block) as unknown as string[]]);

        }
      });
      return blockSubscription.off("data", (block) => {
        if (block != undefined){
            setTransactionHashes(prevHashes => [...prevHashes, ...(block) as unknown as string[]]);

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
