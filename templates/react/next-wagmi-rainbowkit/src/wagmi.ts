import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { Chain, configureChains, createConfig } from 'wagmi'
import { zkSync, zkSyncTestnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!;

const chains: Chain[] = [
  zkSync,
  zkSyncTestnet,
  ...(
      process.env.NODE_ENV === "development" ?
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
export const defaultChain = process.env.NODE_ENV === "development" ? zkSyncTestnet : zkSync; 

const { publicClient } = configureChains(
  chains,
  [
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'zkSync + wagmi + RainbowKit App',
  chains,
  projectId: walletConnectProjectId,
})

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

export { chains }
