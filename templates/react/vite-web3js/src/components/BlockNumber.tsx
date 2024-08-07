import { useEffect, useState } from 'react';
import { useEthereum } from '@/services/ethereum/context.ts';
import { BlockHeaderOutput } from 'web3';

export function BlockNumber() {
  const { getWeb3 } = useEthereum();
  const [blockNumber, setBlockNumber] = useState<bigint | null>(null);

  useEffect(() => {
    const web3 = getWeb3();

    if (!web3) return;

    void web3.eth.subscribe('newBlockHeaders', async (_: Error, blockHeader: BlockHeaderOutput) => {
      console.log(_, blockHeader);

      const block = await web3.eth.getBlock(blockHeader.hash, true);

      setBlockNumber(block.number);
    });
  }, [getWeb3]);

  return <div>{blockNumber?.toString()}</div>;
}
