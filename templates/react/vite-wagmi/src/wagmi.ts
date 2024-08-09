import { http, createConfig } from 'wagmi'
import { type Chain, zksync, zksyncSepoliaTestnet } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'

export const dockerizedLocalNode: Chain = {
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
} as const satisfies Chain;

export const inMemoryLocalNode: Chain = {
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
} as const satisfies Chain;

export const defaultChain = process.env.NODE_ENV === "development" ? zksyncSepoliaTestnet : zksync;

export const config = createConfig({
  chains: [zksync, zksyncSepoliaTestnet, dockerizedLocalNode, inMemoryLocalNode],
  connectors: [
    coinbaseWallet({
      chainId: defaultChain.id,
      appName: 'zkSync + wagmi',
    }),
  ],
  transports: {
    [zksync.id]: http(),
    [zksyncSepoliaTestnet.id]: http(),
    [dockerizedLocalNode.id]: http(),
    [inMemoryLocalNode.id]: http()
  },
});