'use client'

import { useState, useEffect } from 'react';

import { useEthereum } from './Context';

export function BlockNumber() {
  const { getProvider } = useEthereum();
  const [blockNumber, setBlockNumber] = useState<bigint | null>(null);

  useEffect(() => {
    const provider = getProvider();

    if (!provider) return;

    const onBlockHandler = (block: bigint) => {
      setBlockNumber(block);
    };

    provider.on("block", onBlockHandler);

    return () => {
      provider.off("block", onBlockHandler);
    };
  }, [getProvider]);

  return (
    <div>
      {blockNumber?.toString()}
    </div>
  );
}
