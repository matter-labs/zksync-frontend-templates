import { writable, type Writable } from "svelte/store";
import { type Chain, zkSync, zkSyncSepoliaTestnet } from "@wagmi/core/chains";
import {
  getAccount,
  getNetwork,
  watchAccount,
  watchNetwork,
  type GetAccountResult,
  type GetNetworkResult,
} from "@wagmi/core";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi";

export const chains: Chain[] = [
  zkSync,
  zkSyncSepoliaTestnet,
  ...(import.meta.env.MODE === "development"
    ? [
        {
          id: 270,
          name: "Dockerized local node",
          network: "zksync-dockerized-node",
          nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
          rpcUrls: {
            default: {
              http: ["http://localhost:3050"],
            },
            public: {
              http: ["http://localhost:3050"],
            },
          },
          blockExplorers: {
            default: {
              name: "Local Explorer",
              url: "http://localhost:3010",
            },
          },
          testnet: true,
        },
        {
          id: 260,
          name: "In-memory local node",
          network: "zksync-in-memory-node",
          nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
          rpcUrls: {
            default: {
              http: ["http://127.0.0.1:8011"],
            },
            public: {
              http: ["http://127.0.0.1:8011"],
            },
          },
          testnet: true,
        },
      ]
    : []),
];
export const defaultChain =
  import.meta.env.MODE === "development" ? zkSyncSepoliaTestnet : zkSync;

type WagmiStore = {
  account: GetAccountResult;
  network: GetNetworkResult;
};

export function createWagmiStore() {
  const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

  if (!projectId)
    throw new Error("Missing WalletConnect project ID in .env file");

  const metadata = {
    name: "zkSync + wagmi + Web3Modal",
    description: "zkSync + wagmi + Web3Modal Template",
    url: "https://web3modal.com",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  };

  const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

  const web3Modal = createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    defaultChain,
    themeMode: "light",
  });
  const wagmi = writable<WagmiStore>({
    account: getAccount(),
    network: getNetwork(),
  });

  function setField<K extends keyof WagmiStore>(
    field: K,
    value: WagmiStore[K]
  ) {
    wagmi.update((current) => ({ ...current, [field]: value }));
  }

  watchAccount((updatedAccount) => {
    setField("account", updatedAccount);
  });
  watchNetwork((updatedNetwork) => {
    setField("network", updatedNetwork);
  });

  return {
    ...wagmi,
  };
}

export let wagmiStore = createWagmiStore();
