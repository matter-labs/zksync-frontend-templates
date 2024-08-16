import { createWeb3Modal } from '@web3modal/wagmi/vue'
import { type Chain, zksync, zksyncSepoliaTestnet } from '@wagmi/core/chains'
import { getAccount, watchAccount, createConfig, http, injected } from '@wagmi/core';
import { coinbaseWallet, metaMask } from '@wagmi/connectors'

export const chains: Chain[] = [
  zksync,
  zksyncSepoliaTestnet,
  ...(
      import.meta.env.MODE === "development" ?
      [
        {
          id: 270,
          name: "Dockerized local node",
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
          nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
          rpcUrls: {
            default: {
              http: ['http://127.0.0.1:8011'],
            },
            public: {
              http: ['http://127.0.0.1:8011'],
            },
          },
          testnet: true
        },
      ]
      : []
    ),
];
export const defaultChain = import.meta.env.MODE === "development" ? zksyncSepoliaTestnet : zksync;

export const wagmiConfig = createConfig({
  chains: [zksync, zksyncSepoliaTestnet],
  connectors: [injected(), coinbaseWallet(), metaMask()],
  transports: {
    [zksync.id]: http(),
    [zksyncSepoliaTestnet.id]: http(),
  },

})

export const useWagmi = defineStore("wagmi", () => {
  const projectId = useAppConfig().walletConnectProjectID;
  if (!projectId) throw new Error("Missing WalletConnect project ID in .env file");

  const metadata = {
    name: 'zkSync + wagmi + Web3Modal',
    description: 'zkSync + wagmi + Web3Modal Template',
    url: 'https://web3modal.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  }

  const web3Modal = createWeb3Modal({
    wagmiConfig,
    projectId,
    metadata,
    defaultChain, 
    themeMode: "light"
  })

  const account = ref(getAccount(wagmiConfig));
    watchAccount(wagmiConfig, {
    onChange(updatedAccount) {
    account.value = updatedAccount;
   },
  });

  return { account }
});
