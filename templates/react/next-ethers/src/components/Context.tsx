'use client';

import { JsonRpcSigner } from 'ethers';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserProvider } from 'zksync-ethers';

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
  blockExplorerUrl: "https://explorer.zksync.io"
}
const zkSyncSepoliaTestnet: Chain = {
  id: 300,
  name: "zkSync Sepolia Testnet",
  rpcUrl: "https://rpc.ankr.com/eth_sepolia",
  blockExplorerUrl: "https://sepolia.etherscan.io"
}
const zkSyncGoerliTestnet: Chain = {
  id: 280,
  name: "zkSync Goerli Testnet",
  rpcUrl: "https://testnet.era.zksync.dev",
  blockExplorerUrl: "https://goerli.explorer.zksync.io"
}
export const chains: Chain[] = [
  zkSync,
  zkSyncSepoliaTestnet,
  zkSyncGoerliTestnet,
  ...(
    process.env.NODE_ENV === "development" ?
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
          rpcUrl: 'http://127.0.0.1:8011',
        },
      ]
      : []
    ),
];
export const defaultChain = process.env.NODE_ENV === "development" ? zkSyncSepoliaTestnet : zkSync;

let web3Provider: BrowserProvider | null = null;

interface EthereumContextValue {
  account: { isConnected: true; address: string; } | { isConnected: false; address: null; };
  network: Chain | null;
  switchNetwork: (chainId: number) => Promise<void>;
  connect: () => void;
  disconnect: () => void;
  getProvider: () => BrowserProvider | null;
  getSigner: () => Promise<JsonRpcSigner | undefined>;
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

  const onNetworkChange = async (data: { chainId: BigInt; name: string }) => {
    const chainId = parseInt(data.chainId.toString());
    const currentChain = chains.find((chain: any) => chain.id === chainId);
    setNetwork(currentChain ?? { id: chainId, name: null, rpcUrl: null, unsupported: true });
  }

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
    } catch (error) {
      if ((error as any)?.code === 4902) { // 4902 - chain not added
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
  }

  const getProvider = () => web3Provider;
  const getSigner = async () => await web3Provider?.getSigner();

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