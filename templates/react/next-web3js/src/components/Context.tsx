'use client'

import { Web3, EIP1193Provider } from 'web3';
import { ZkSyncPlugin } from 'web3-plugin-zksync';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { on } from 'events';

type Chain = {
    id: string;
    name: null | string;
    rpcUrl: null | string;
    blockExplorerUrl?: string;
    unsupported?: true;
  };


const zkSync: Chain = {
    id: "324",
    name: "zkSync",
    rpcUrl: "https://mainnet.era.zksync.io",
    blockExplorerUrl: "https://explorer.zksync.io"
  }
  const zkSyncSepoliaTestnet: Chain = {
    id: "300",
    name: "zkSync Sepolia Testnet",
    rpcUrl: "https://rpc.ankr.com/eth_sepolia",
    blockExplorerUrl: "https://sepolia.etherscan.io"
  }
  const zkSyncGoerliTestnet: Chain = {
    id: "280",
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
  
let web3: Web3 | null = null;

interface EthereumContextValue {
    account: { isConnected: true; address: string; } | { isConnected: false; address: null; };
    network: Chain | null;
    switchNetwork: (chainId: string) => Promise<void>;
    connect: () => void;
    disconnect: () => void;
    getWeb3: () => Web3 | null;
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
      const chainIdStr = web3?.utils.hexToNumberString(chainId)
      const currentChain = chains.find((chain: any) => chain.id === chainIdStr);
      setNetwork(currentChain ?? { id: chainIdStr, name: null, rpcUrl: null, unsupported: true });
    }

  
    const connect = async () => {
      if (!getEthereumContext()) throw new Error("No injected wallets found");
      web3 = new Web3((window as any).ethereum);


      

      const zkSyncPlugin = new ZkSyncPlugin(getEthereumContext());
      web3.registerPlugin(zkSyncPlugin);
      const accounts = await web3.eth.requestAccounts();
      const chain = await web3.eth.getChainId();
      if (accounts.length > 0) {
        onAccountChange(accounts);
        onNetworkChange(web3.utils.toHex(chain));
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
      const chain = chains.find((chain: any) => chain.id === chainId);
      if (!chain) throw new Error("Unsupported chain");
    
      const hexChainId = web3?.utils.numberToHex(chainId);
      if (web3)
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
  
    const getWeb3 = () => web3;
    // const getProvider = () => MetaMaskProvider;
    return (
      <EthereumContext.Provider value={{
        account,
        network,
        switchNetwork,
        connect,
        disconnect,
        getWeb3,
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