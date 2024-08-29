'use client'

import { useState, useEffect, useCallback } from 'react';
import { useEthereum } from './Context';

export function BlockNumber() {
  const { getProvider } = useEthereum();
  const [blockNumber, setBlockNumber] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAndSubscribeToBlockUpdates = useCallback(async () => {
    setError(null);
    const provider = getProvider();
    if (!provider) {
      setError("Provider not available");
      return () => {};
    }

    try {
      const currentBlockNumber = await provider.getBlockNumber();
      setBlockNumber(BigInt(currentBlockNumber));

      const onBlockHandler = (blockNumber: number) => {
        setBlockNumber(BigInt(blockNumber));
      };

      provider.on("block", onBlockHandler);

      return () => {
        provider.off("block", onBlockHandler);
      };
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      return () => {};
    }
  }, [getProvider]);

  useEffect(() => {
    const unsubscribe = fetchAndSubscribeToBlockUpdates();

  }, [fetchAndSubscribeToBlockUpdates]);

  return (
    <div>
      {error ? (
        <div>Error: {error}</div>
      ) : blockNumber === null ? (
        <div>Loading block number...</div>
      ) : (
        <div>{blockNumber.toString()}</div>
      )}
    </div>
  );
}
