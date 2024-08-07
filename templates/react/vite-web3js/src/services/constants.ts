import { Chain } from '../types/web3.ts';

const zkSync: Chain = {
  id: '324',
  name: 'zkSync',
  rpcUrl: 'https://mainnet.era.zksync.io',
  blockExplorerUrl: 'https://explorer.zksync.io',
};

const zkSyncSepoliaTestnet: Chain = {
  id: '300',
  name: 'zkSync Sepolia Testnet',
  rpcUrl: 'https://sepolia.era.zksync.dev',
  blockExplorerUrl: 'https://sepolia.etherscan.io',
};

export const chains: Chain[] = [
  zkSync,
  zkSyncSepoliaTestnet,
  ...(process.env.NODE_ENV === 'development'
    ? [
        {
          id: '270',
          name: 'Dockerized local node',
          rpcUrl: 'http://localhost:3050',
          blockExplorerUrl: 'http://localhost:3010',
        },
        {
          id: '260',
          name: 'In-memory local node',
          rpcUrl: 'http://127.0.0.1:8011',
        },
      ]
    : []),
];

export const defaultChain = process.env.NODE_ENV === 'development' ? zkSyncSepoliaTestnet : zkSync;
