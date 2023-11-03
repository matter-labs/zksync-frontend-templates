import React, { useState, useEffect, createContext, useContext } from 'react';
import { Signer, Web3Provider } from 'zksync-web3';

type Chain = {
  id: number;
  name: null | string;
  rpcUrl: null | string;
  blockExplorerUrl?: string;
  unsupported?: true;
};
export const chains: Chain[] = [
  {
    id: 324,
    name: "zkSync Era",
    rpcUrl: "https://mainnet.era.zksync.io",
    blockExplorerUrl: "https://explorer.zksync.io"
  },
  {
    id: 280,
    name: "zkSync Era Testnet",
    rpcUrl: "https://testnet.era.zksync.dev",
    blockExplorerUrl: "https://goerli.explorer.zksync.io"
  },
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

let web3Provider: Web3Provider | null = null;

interface EthereumContextValue {
  account: { isConnected: true; address: string; } | { isConnected: false; address: null; };
  network: Chain | null;
  switchNetwork: (chainId: number) => Promise<void>;
  connect: () => void;
  disconnect: () => void;
  getProvider: () => Web3Provider | null;
  getSigner: () => Signer | undefined;
}

const EthereumContext = createContext<EthereumContextValue | null>(null);

export const EthereumProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<{ isConnected: true; address: string; } | { isConnected: false; address: null; }>({ isConnected: false, address: null });
  const [network, setNetwork] = useState<Chain | null>(null);

  const getEthereumContext = () => (window as any).ethereum;

  const onAccountChange = async (accounts: string[]) => {
    if (accounts.length > 0) {
      setAccount({
        isConnected: true,
        address: accounts[0],
      });
    } else {
      disconnect();
    }
  }

  const onNetworkChange = async (data: { chainId: number; name: string }) => {
    const currentChain = chains.find((chain: any) => chain.id === data.chainId);
    setNetwork(currentChain ?? { id: data.chainId, name: null, rpcUrl: null, unsupported: true });
  }

  const connect = async () => {
    if (!getEthereumContext()) throw new Error("No injected wallets found");

    web3Provider = new Web3Provider((window as any).ethereum, "any");
    const accounts = await web3Provider?.send("eth_requestAccounts", []);
    if (accounts.length > 0) {
      onAccountChange(accounts);
      getEthereumContext()?.on("accountsChanged", onAccountChange);
      web3Provider?.on("network", onNetworkChange);
    } else {
      throw new Error("No accounts found");
    }
  }

  const disconnect = () => {
    setAccount({
      isConnected: false,
      address: null,
    });
    setNetwork(null);
    getEthereumContext()?.off("accountsChanged", onAccountChange);
    web3Provider?.off("network", onNetworkChange);
  }

  useEffect(() => {
    connect();

    return () => { // Clean-up on component unmount
      disconnect();
    }
  }, []);

  const switchNetwork = async (chainId: number) => {
    const chain = chains.find((chain: any) => chain.id === chainId);
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

  const getProvider = () => web3Provider;
  const getSigner = () => web3Provider?.getSigner();

  return (
    <EthereumContext.Provider value={{
      account,
      network,
      switchNetwork,
      connect,
      disconnect,
      getProvider,
      getSigner
    }}>
      {children}
    </EthereumContext.Provider>
  );
}

export const useEthereum = () => {
  const context = useContext(EthereumContext);
  if (!context) {
    throw new Error("useEthereum must be used within an EthereumProvider");
  }
  return context;
}