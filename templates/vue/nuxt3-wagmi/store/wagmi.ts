import { type Chain, zkSync, zkSyncSepoliaTestnet } from 'viem/chains';
import { getAccount, watchAccount, createConfig, http } from '@wagmi/core';
import { coinbaseWallet, injected } from '@wagmi/connectors';

export const dockerizedLocalNode: Chain = {
  id: 270,
  name: "Dockerized local node",
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: 'http://localhost:3050',
    public: 'http://localhost:3050',
  },
  blockExplorers: {
    default: {
      name: 'Local Explorer',
      url: 'http://localhost:3010',
    },
  },
  testnet: true,
} as const;

export const inMemoryLocalNode: Chain = {
  id: 260,
  name: "In-memory local node",
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: 'http://127.0.0.1:8011',
    public: 'http://127.0.0.1:8011',
  },
  testnet: true,
} as const;

export const defaultChain = import.meta.env.MODE === "development" ? zkSyncSepoliaTestnet : zkSync;

export const useWagmi = defineStore("wagmi", () => {
  const wagmiConfig = createConfig({
    chains: [defaultChain, dockerizedLocalNode, inMemoryLocalNode],
    connectors: [
      coinbaseWallet({
        chainId: defaultChain.id,
        appName: 'zkSync + wagmi',
      }),
      injected({
        target: 'metaMask',
        shimDisconnect: true,
      }),
    ],
  });

  const account = ref(getAccount(wagmiConfig));
  watchAccount(wagmiConfig, (updatedAccount) => {
    account.value = updatedAccount;
  });

  return {
    account,
    chain: ref(defaultChain),
  };
});
