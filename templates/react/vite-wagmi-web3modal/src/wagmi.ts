import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { type Chain, zksync, zksyncSepoliaTestnet } from 'wagmi/chains'

const walletConnectProjectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID

const metadata = {
  name: "zkSync + wagmi + Web3Modal",
  description: "zkSync + wagmi + Web3Modal Template",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

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

const chains: [Chain, ...Chain[]] = [
  zksync,
  zksyncSepoliaTestnet,
  ...(process.env.NODE_ENV === "development" ? [dockerizedLocalNode, inMemoryLocalNode] : []),
];

export const defaultChain = process.env.NODE_ENV === "development" ? zksyncSepoliaTestnet : zksync;

export const config = defaultWagmiConfig(
  {
    chains,
    projectId: walletConnectProjectId,
    metadata
  }
);

createWeb3Modal( // Initiate modal instance
  {
    wagmiConfig: config,
    projectId: walletConnectProjectId,
    defaultChain, 
    themeMode: "light"
  }
);
