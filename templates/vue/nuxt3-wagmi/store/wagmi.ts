import { type Chain, zksync, zksyncSepoliaTestnet } from '@wagmi/core/chains'
import { getAccount, watchAccount, createConfig, http, injected } from '@wagmi/core'
import { coinbaseWallet, metaMask } from '@wagmi/connectors'

export const chains: Chain[] = [
  zksync,
  zksyncSepoliaTestnet,
  ...(
      import.meta.env.MODE === "development" ?
      [
        {
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
        },
        {
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
        },
      ]
      : []
    ),
];
export const defaultChain = import.meta.env.MODE === "development" ? zksyncSepoliaTestnet : zksync;

export const wagmiConfig = createConfig({
 chains: chains.length > 0 ? (chains as [Chain, ...Chain[]]) : [defaultChain], 
  connectors: [injected(), coinbaseWallet(), metaMask()],
  transports: {
    [zksync.id]: http(),
    [zksyncSepoliaTestnet.id]: http(),
    270: http(),  
    260: http(),
  },
})

export const useWagmi = defineStore("wagmi", () => {  
  const account = ref(getAccount(wagmiConfig));
  watchAccount(wagmiConfig, {
    onChange(updatedAccount) {
      account.value = updatedAccount;
    },
  });

  return { account };
});
