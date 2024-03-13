import { writable } from "svelte/store";
import { type Chain, zkSync, zkSyncSepoliaTestnet } from "@wagmi/core/chains";
import {
  getAccount,
  getNetwork,
  watchAccount,
  watchNetwork,
  configureChains,
  createConfig,
  type GetAccountResult,
  type GetNetworkResult,
} from "@wagmi/core";
import { InjectedConnector } from "@wagmi/core/connectors/injected";
import { MetaMaskConnector } from "@wagmi/core/connectors/metaMask";
import { CoinbaseWalletConnector } from "@wagmi/core/connectors/coinbaseWallet";
import { publicProvider } from "@wagmi/core/providers/public";

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
  const { publicClient, webSocketPublicClient } = configureChains(chains, [
    publicProvider(),
  ]);

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: "wagmi",
        },
      }),
      new InjectedConnector({
        chains,
        options: {
          name: "Injected",
          shimDisconnect: true,
        },
      }),
    ],
    publicClient,
    webSocketPublicClient,
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

export const wagmiStore = createWagmiStore();
