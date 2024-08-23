import { useEthereum } from '@/services/ethereum/context.ts';
import { useAsync } from '@/hooks/use-async.ts';
import { chains } from '@/services/constants.ts';

export function NetworkSwitcher() {
  const { switchNetwork: switchToChainByID, network } = useEthereum();
  const { execute: switchNetwork, error } = useAsync(switchToChainByID);

  return (
    <div>
      <div>
        Connected to {network?.name || network?.id}
        {network?.unsupported && <span>(unsupported)</span>}
      </div>
      <br />
      <div>
        Switch to:
        {chains.map((item, index) => (
          <button key={index} onClick={() => switchNetwork(item.id)}>
            {item.name}
          </button>
        ))}
      </div>

      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
