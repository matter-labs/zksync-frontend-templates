import { Web3Provider } from "zksync-web3";

type Chain = {
  id: number;
  name: null | string;
  rpcUrl: null | string;
  blockExplorerUrl?: string;
  unsupported?: true;
};
const zkSync: Chain = {
  id: 324,
  name: "zkSync Era",
  rpcUrl: "https://mainnet.era.zksync.io",
  blockExplorerUrl: "https://explorer.zksync.io"
}
const zkSyncTestnet: Chain = {
  id: 280,
  name: "zkSync Era Testnet",
  rpcUrl: "https://testnet.era.zksync.dev",
  blockExplorerUrl: "https://goerli.explorer.zksync.io"
}
export const chains: Chain[] = [
  zkSync,
  zkSyncTestnet,
  ...(
    import.meta.env.MODE === "development" ?
    [
        {
          id: 270,
          name: "Dockerized local node",
          rpcUrl: 'http://localhost:3050',
          blockExplorerUrl: "http://localhost:3010"
        },
        {
          id: 260,
          name: "In-memory local node",
          rpcUrl: 'http://localhost:8011',
        },
      ]
      : []
    ),
];
export const defaultChain = import.meta.env.MODE === "development" ? zkSyncTestnet : zkSync;

export const useEthers = defineStore("ethers", () => {
  let web3Provider: Web3Provider | null = null;
  const account = ref<{ isConnected: true; address: string; } | { isConnected: false; address: null; }>({
    isConnected: false,
    address: null,
  });
  const network = ref<Chain | null>(null);

  const getEthereumContext = () => (window as any).ethereum;

  const connect = async () => {
    if (!getEthereumContext()) throw new Error("No injected wallets found")

    web3Provider = new Web3Provider((window as any).ethereum, "any");
    const accounts = await web3Provider?.send("eth_requestAccounts", [])
    if (accounts.length > 0) {
      onAccountChange(accounts);
      getEthereumContext()?.on("accountsChanged", onAccountChange);
      web3Provider?.on("network", onNetworkChange);
    } else {
      throw new Error("No accounts found");
    }
  }
  const disconnect = () => {
    account.value = {
      isConnected: false,
      address: null,
    };
    network.value = null;
    getEthereumContext()?.off("accountsChanged", onAccountChange);
    web3Provider?.off("network", onNetworkChange);
  }
  connect();

  const onAccountChange = async (accounts: string[]) => {
    if (accounts.length > 0) {
      account.value = {
        isConnected: true,
        address: accounts[0],
      };
    } else {
      disconnect();
    }
  }
  const onNetworkChange = async (data: { chainId: number; name: string }) => {
    const currentChain = chains.find((chain) => chain.id === data.chainId);
    network.value = currentChain ?? { id: data.chainId, name: null, rpcUrl: null, unsupported: true }
  }
  const switchNetwork = async (chainId: number) => {
    const chain = chains.find((chain) => chain.id === chainId);
    if (!chain) throw new Error("Unsupported chain");

    const hexChainId = "0x" + chain.id.toString(16);
    try {
      await getEthereumContext()?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId }],
      });
    } catch {
      getEthereumContext()?.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: "0x" + chain.id.toString(16),
          rpcUrls: [chain.rpcUrl],
          chainName: chain.name,
          nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18
          },
          blockExplorerUrls: chain.blockExplorerUrl ? [chain.blockExplorerUrl] : null
        }]
      });
    }
  }

  return {
    account,
    network,

    switchNetwork,
    getProvider: () => web3Provider,
    getSigner: () => web3Provider?.getSigner(),

    connect,
    disconnect,
  }
});