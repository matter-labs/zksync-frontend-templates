'use client'

import { useState, useEffect } from 'react';

import { useEthereum } from './Context';

export function BlockNumber() {
  const { getZKsync } = useEthereum();
  const [blockNumber, setBlockNumber] = useState<bigint | null>(null);

  useEffect(() => {
    const zkSync = getZKsync();

    if (!zkSync) return;

    const onBlock = async () => {
        const subscription = await zkSync.L2.eth.subscribe("newHeads");
        subscription.on('data', (block) => {
            if (block && block.number) {
                setBlockNumber(block.number as bigint);
            }
        })
        return subscription.off("data", (block) => {
              if (block && block.number) {
                  setBlockNumber(block.number as bigint);
              }
            });
        }
    onBlock();
    
    }, [getZKsync]);

  return (
    <div>
      {blockNumber?.toString()}
    </div>
  );
}
