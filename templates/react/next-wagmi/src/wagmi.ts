import { configureChains, createConfig } from 'wagmi'
import { type Chain, zkSync, zkSyncTestnet } from 'wagmi/chains'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

import { publicProvider } from 'wagmi/providers/public'

export const chains: Chain[] = [
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
]
export const defaultChain = process.env.NODE_ENV === "development" ? zkSyncTestnet : zkSync;

const { publicClient, webSocketPublicClient } = configureChains(
  chains,
  [
    publicProvider(),
  ],
)

export const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'zkSync + wagmi',
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})
