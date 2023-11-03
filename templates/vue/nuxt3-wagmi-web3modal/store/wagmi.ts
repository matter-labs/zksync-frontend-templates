import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/vue'
import { type Chain, zkSync, zkSyncTestnet } from '@wagmi/core/chains'
import { getAccount, getNetwork, watchAccount, watchNetwork } from '@wagmi/core';

export const chains: Chain[] = [
  zkSync,
  zkSyncTestnet,
  ...(
      import.meta.env.MODE === "development" ?
      [
        {
          id: 270,
          name: "Dockerized local node",
          network: "zksync-dockerized-node",
          nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
          rpcUrls: {
            default: {
              http: ['http://localhost:3050'],
            },
            public: {
              http: ['http://localhost:3050'],
            },
          },
          blockExplorers: {
            default: {
              name: 'Local Explorer',
              url: 'http://localhost:3010',
            },
          },
          testnet: true
        },
        {
          id: 260,
          name: "In-memory local node",
          network: "zksync-in-memory-node",
          nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
          rpcUrls: {
            default: {
              http: ['http://localhost:8011'],
            },
            public: {
              http: ['http://localhost:8011'],
            },
          },
          testnet: true
        },
      ]
      : []
    ),
];
export const useWagmi = defineStore("wagmi", () => {
  const projectId = useAppConfig().walletConnectProjectID;
  if (!projectId) throw new Error("Missing WalletConnect project ID in .env file");

  const metadata = {
    name: 'zkSync + wagmi + Web3Modal',
    description: 'zkSync + wagmi + Web3Modal Template',
    url: 'https://web3modal.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  }

  const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

  const web3Modal = createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    defaultChain: zkSync, 
    themeMode: "light"
  })

  const account = ref(getAccount());
  const network = ref(getNetwork());
  watchAccount((updatedAccount) => {
    account.value = updatedAccount;
  });
  watchNetwork((updatedNetwork) => {
    network.value = updatedNetwork;
  });

  return {
    account,
    network,
  }
});