import { writable } from "svelte/store";
import { type Chain, zksync, zksyncSepoliaTestnet } from "@wagmi/core/chains";
import { getAccount, watchAccount, createConfig, http, injected, type GetAccountReturnType } from '@wagmi/core';
import { coinbaseWallet, metaMask } from '@wagmi/connectors'
import { createWeb3Modal } from "@web3modal/wagmi";

export const chains: Chain[] = [
  zksync,
  zksyncSepoliaTestnet,
  ...(import.meta.env.MODE === "development"
    ? [
        {
          id: 270,
          name: "Dockerized local node",
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
export const defaultChain = import.meta.env.MODE === "development" ? zksyncSepoliaTestnet : zksync;

export const wagmiConfig = createConfig({
  chains: [zksync, zksyncSepoliaTestnet],
  connectors: [injected(), coinbaseWallet(), metaMask()],
  transports: {
    [zksync.id]: http(),
    [zksyncSepoliaTestnet.id]: http(),
  },
})

type WagmiStore = {
  account: GetAccountReturnType;
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

  const web3Modal = createWeb3Modal({
    wagmiConfig,
    projectId,
    defaultChain,
    metadata,
    themeMode: "light",
  });

  const wagmi = writable<WagmiStore>({
    account: getAccount(wagmiConfig),
  });


  function setField<K extends keyof WagmiStore>(
    field: K,
    value: WagmiStore[K]
  ) {
    wagmi.update((current) => ({ ...current, [field]: value }));
  }

   watchAccount(wagmiConfig, {
    onChange(updatedAccount) {
    setField("account", updatedAccount);
    }
  });

  return {
    ...wagmi,
  };
}

export let wagmiStore = createWagmiStore();
