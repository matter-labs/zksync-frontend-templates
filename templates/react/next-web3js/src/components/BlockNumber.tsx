'use client'

import { useState, useEffect } from 'react';

import { useEthereum } from './Context';

export function BlockNumber() {
  const { getWeb3 } = useEthereum();
  const [blockNumber, setBlockNumber] = useState<bigint | null>(null);

  useEffect(() => {
    const web3 = getWeb3();

    if (!web3) return;

    const onBlock = async () => {
        const subscription = await web3.ZKsync.L2.eth.subscribe("newHeads");
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
    
    }, [getWeb3]);

  return (
    <div>
      {blockNumber?.toString()}
    </div>
  );
}
