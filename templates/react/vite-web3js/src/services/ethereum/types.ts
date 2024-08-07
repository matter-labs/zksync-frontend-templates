import type { Chain } from '@/types/web3.ts';
import { Web3 } from 'web3';

export type EthereumContextValue = {
  account: { isConnected: true; address: string } | { isConnected: false; address: null };
  network: Chain | null;
  switchNetwork: (chainId: string) => Promise<void>;
  connect: () => void;
  disconnect: () => void;
  getWeb3: () => Web3 | null;
};

export type Account =
  | { isConnected: true; address: string }
  | { isConnected: false; address: null };

export type Network = Chain | null