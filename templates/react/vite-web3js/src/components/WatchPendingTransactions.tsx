import { useEffect, useState } from 'react';
import { useEthereum } from '@/services/ethereum/context.ts';
import { BlockHeaderOutput } from 'web3';

export function WatchPendingTransactions() {
  const { getZKsync } = useEthereum();
  const [transactionHashes, setTransactionHashes] = useState<string[]>([]);

  useEffect(() => {
    const zkSync = getZKsync();
    if (!zkSync) return;

    const onBlock = async () => {
      if (!zkSync) return;

      const newHeadsSubscription = await zkSync.L2.eth.subscribe('newHeads');

      function handleSubscriptionSet(block: BlockHeaderOutput) {
        if (block && block.hash) {
          setTransactionHashes((prevHashes) => [...prevHashes, block.hash as unknown as string]);
        }
      }

      newHeadsSubscription.on('data', handleSubscriptionSet);

      return newHeadsSubscription.off('data', handleSubscriptionSet);
    };

    void onBlock();
  }, [getZKsync]);

  return (
    <div>
      <details>
        <summary>{transactionHashes.length} transaction hashes</summary>

        <pre>{[...transactionHashes].reverse().join('\n')}</pre>
      </details>
    </div>
  );
}
