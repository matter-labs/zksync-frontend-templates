import { writable } from "svelte/store";
import { BrowserProvider } from "zksync-ethers";

type Chain = {
  id: number;
  name: null | string;
  rpcUrl: null | string;
  blockExplorerUrl?: string;
  unsupported?: true;
};
const zkSync: Chain = {
  id: 324,
  name: "zkSync",
  rpcUrl: "https://mainnet.era.zksync.io",
  blockExplorerUrl: "https://explorer.zksync.io",
};
const zkSyncSepoliaTestnet: Chain = {
  id: 300,
  name: "zkSync Sepolia Testnet",
  rpcUrl: "https://rpc.ankr.com/eth_sepolia",
  blockExplorerUrl: "https://sepolia.etherscan.io",
};
const zkSyncGoerliTestnet: Chain = {
  id: 280,
  name: "zkSync Goerli Testnet",
  rpcUrl: "https://testnet.era.zksync.dev",
  blockExplorerUrl: "https://goerli.explorer.zksync.io",
};
export const chains: Chain[] = [
  zkSync,
  zkSyncSepoliaTestnet,
  zkSyncGoerliTestnet,
  ...(import.meta.env.MODE === "development"
    ? [
        {
          id: 270,
          name: "Dockerized local node",
          rpcUrl: "http://localhost:3050",
          blockExplorerUrl: "http://localhost:3010",
        },
        {
          id: 260,
          name: "In-memory local node",
          rpcUrl: "http://127.0.0.1:8011",
        },
      ]
    : []),
];
export const defaultChain =
  import.meta.env.MODE === "development" ? zkSyncSepoliaTestnet : zkSync;

type EthersStore = {
  account: {
    isConnected: boolean;
    address: string | null;
  };
  network: Chain | null;
};

export function createEthersStore() {
  const ethers = writable<EthersStore>({
    account: {
      isConnected: false,
      address: null,
    },
    network: null,
  });

  function setField<K extends keyof EthersStore>(
    field: K,
    value: EthersStore[K]
  ) {
    ethers.update((current) => ({ ...current, [field]: value }));
  }

  let web3Provider: BrowserProvider | null = null;

  const getEthereumContext = () => (window as any).ethereum;

  const connect = async () => {
    if (!getEthereumContext()) throw new Error("No injected wallets found");

    web3Provider = new BrowserProvider((window as any).ethereum, "any");
    const accounts = await web3Provider?.send("eth_requestAccounts", []);
    if (accounts.length > 0) {
      onAccountChange(accounts);
      getEthereumContext()?.on("accountsChanged", onAccountChange);
      web3Provider?.on("network", onNetworkChange);
    } else {
      throw new Error("No accounts found");
    }
  };
  const disconnect = () => {
    setField("account", {
      isConnected: false,
      address: null,
    });
    setField("network", null);
    getEthereumContext()?.off("accountsChanged", onAccountChange);
    web3Provider?.off("network", onNetworkChange);
  };
  connect();

  const onAccountChange = async (accounts: string[]) => {
    if (accounts.length > 0) {
      setField("account", {
        isConnected: true,
        address: accounts[0],
      });
    } else {
      disconnect();
    }
  };
  const onNetworkChange = async (data: { chainId: BigInt; name: string }) => {
    const chainId = parseInt(data.chainId.toString());
    const currentChain = chains.find((chain) => chain.id === chainId);
    setField(
      "network",
      currentChain ?? {
        id: chainId,
        name: null,
        rpcUrl: null,
        unsupported: true,
      }
    );
  };
  const switchNetwork = async (chainId: number) => {
    const chain = chains.find((chain) => chain.id === chainId);
    if (!chain) throw new Error("Unsupported chain");

    const hexChainId = "0x" + chain.id.toString(16);
    try {
      await getEthereumContext()?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId }],
      });
      await onNetworkChange({
        chainId: BigInt(chain.id),
        name: chain.name || `${chain.id}`,
      });
    } catch (error) {
      if ((error as any)?.code === 4902) {
        // 4902 - chain not added
        getEthereumContext()?.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x" + chain.id.toString(16),
              rpcUrls: [chain.rpcUrl],
              chainName: chain.name,
              nativeCurrency: {
                name: "Ether",
                symbol: "ETH",
                decimals: 18,
              },
              blockExplorerUrls: chain.blockExplorerUrl
                ? [chain.blockExplorerUrl]
                : null,
            },
          ],
        });
      }
    }
  };

  return {
    ...ethers,

    switchNetwork,
    getProvider: () => web3Provider,
    getSigner: () => web3Provider?.getSigner(),

    connect,
    disconnect,
  };
}

export const etherStore = createEthersStore();
