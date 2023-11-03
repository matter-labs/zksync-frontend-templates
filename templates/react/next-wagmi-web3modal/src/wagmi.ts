import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { type Chain, zkSync, zkSyncTestnet } from "wagmi/chains";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!;

const metadata = {
  name: "zkSync + wagmi + Web3Modal",
  description: "zkSync + wagmi + Web3Modal Template",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

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
];

export const config = defaultWagmiConfig(
  {
    chains,
    projectId: walletConnectProjectId,
    metadata
  }
);

const modal = createWeb3Modal( // Initiate modal instance
  {
    wagmiConfig: config,
    projectId: walletConnectProjectId,
    chains,
    defaultChain: zkSync, 
    themeMode: "light"
  }
);
