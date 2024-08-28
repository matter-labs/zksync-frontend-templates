'use client'

import { numberToHex, toHex, hexToNumberString } from 'web3-utils';
import { ZKsyncPlugin } from 'web3-plugin-zksync';
import React, { useState, useEffect, createContext, useContext } from 'react';

type Chain = {
    id: string;
    name: null | string;
    rpcUrl: null | string;
    blockExplorerUrl?: string;
    unsupported?: true;
  };


const zkSync: Chain = {
    id: "324",
    name: "ZKsync",
    rpcUrl: "https://mainnet.era.zksync.io",
    blockExplorerUrl: "https://explorer.zksync.io"
  }
  const zkSyncSepoliaTestnet: Chain = {
    id: "300",
    name: "ZKsync Sepolia Testnet",
    rpcUrl: "https://rpc.ankr.com/eth_sepolia",
    blockExplorerUrl: "https://sepolia.etherscan.io"
  }
  export const chains: Chain[] = [
    zkSync,
    zkSyncSepoliaTestnet,
    ...(
      process.env.NODE_ENV === "development" ?
      [
          {
            id: "270",
            name: "Dockerized local node",
            rpcUrl: 'http://localhost:3050',
            blockExplorerUrl: "http://localhost:3010"
          },
          {
            id: "260",
            name: "In-memory local node",
            rpcUrl: 'http://127.0.0.1:8011',
          },
        ]
        : []
      ),
  ];
  export const defaultChain = process.env.NODE_ENV === "development" ? zkSyncSepoliaTestnet : zkSync;

let zkSyncPlugin: ZKsyncPlugin | null = null;

interface EthereumContextValue {
    account: { isConnected: true; address: string; } | { isConnected: false; address: null; };
    network: Chain | null;
    switchNetwork: (chainId: string) => Promise<void>;
    connect: () => void;
    disconnect: () => void;
    getZKsync: () => ZKsyncPlugin | null;
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
  
    const onNetworkChange = async (chainId: string) => {
      const chainIdStr = hexToNumberString(chainId);
      if (typeof chainIdStr === 'string') {
        const currentChain = chains.find((chain: any) => chain.id === chainIdStr);
        setNetwork(currentChain ?? { id: chainIdStr, name: null, rpcUrl: null, unsupported: true });
      }
    };

  
    const connect = async () => {
      if (!getEthereumContext()) throw new Error("No injected wallets found");
      zkSyncPlugin = new ZKsyncPlugin(getEthereumContext());

      const l2 = zkSyncPlugin.L2;
      const accounts = await l2.eth.requestAccounts();
      const chain = await l2.eth.getChainId();
      if (accounts.length > 0) {
        onAccountChange(accounts);
        onNetworkChange(toHex(chain));
        getEthereumContext()?.on("accountsChanged", onAccountChange);
        getEthereumContext()?.on("chainChanged", onNetworkChange);
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
      getEthereumContext()?.off("chainChanged", onNetworkChange);
    }
  
    useEffect(() => {
      connect();
  
      return () => { // Clean-up on component unmount
        disconnect();
      }
    }, []);
  
    const switchNetwork = async (chainId: string) => {
      console.log("chainID", chainId)
      console.log(typeof(chainId));
      const chain = chains.find((chain: any) => chain.id === chainId);
      if (!chain) throw new Error("Unsupported chain");
    
      const hexChainId = numberToHex(chainId);
      if (zkSyncPlugin)
      try {
        getEthereumContext()?.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: hexChainId }],
        })
      } catch (error) {
        if ((error as any)?.code === 4902) { // 4902 - chain not added
          getEthereumContext()?.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: hexChainId,
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

    const getZKsync = () => zkSyncPlugin;
    // const getProvider = () => MetaMaskProvider;
    return (
      <EthereumContext.Provider value={{
        account,
        network,
        switchNetwork,
        connect,
        disconnect,
        getZKsync,
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