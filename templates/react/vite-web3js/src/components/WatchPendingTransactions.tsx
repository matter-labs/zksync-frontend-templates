import { useEffect, useState } from 'react';
import { useEthereum } from '@/services/ethereum/context.ts';
import { BlockHeaderOutput } from 'web3';

export function WatchPendingTransactions() {
  const { getWeb3 } = useEthereum();
  const [transactionHashes, setTransactionHashes] = useState<string[]>([]);

  useEffect(() => {
    const web3 = getWeb3();
    if (!web3) return;

    const onBlock = async () => {
      if (!web3) return;

      const newHeadsSubscription = await web3.ZKsync.L2.eth.subscribe('newHeads');

      function handleSubscriptionSet(block: BlockHeaderOutput) {
        if (block && block.hash) {
          setTransactionHashes((prevHashes) => [...prevHashes, block.hash as unknown as string]);
        }
      }

      newHeadsSubscription.on('data', handleSubscriptionSet);

      return newHeadsSubscription.off('data', handleSubscriptionSet);
    };

    void onBlock();
  }, [getWeb3]);

  return (
    <div>
      <details>
        <summary>{transactionHashes.length} transaction hashes</summary>

        <pre>{[...transactionHashes].reverse().join('\n')}</pre>
      </details>
    </div>
  );
}
