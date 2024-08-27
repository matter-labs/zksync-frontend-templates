import { type ReactNode, useState, useEffect, useCallback } from 'react';
import { Web3, ProviderError } from 'web3';
import { ZKsyncPlugin } from 'web3-plugin-zksync';
import type { Chain } from '@/types/web3.ts';
import { Account, Network } from './types.ts';
import { chains } from '../constants.ts';
import { EthereumContext } from './context.ts';

let web3: Web3 | null = null;

export const EthereumContextProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<Account>({ isConnected: false, address: null });
  const [network, setNetwork] = useState<Network>(null);

  const getEthereumContext = () => window.ethereum;

  const onNetworkChange = useCallback((chainId: string) => {
    const currentChain = chains.find((chain: Chain) => chain.id === chainId);
    const strChainId = String(web3?.utils.hexToNumber(chainId));

    setNetwork(
      currentChain ?? {
        id: strChainId,
        name: null,
        rpcUrl: null,
        unsupported: true,
      }
    );
  }, []);

  const disconnect = useCallback(async () => {
    setAccount({
      isConnected: false,
      address: null,
    });

    setNetwork(null);
  }, []);

  const onAccountChange = useCallback(
    (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount({
          isConnected: true,
          address: accounts[0],
        });

        getEthereumContext()?.on('accountsChanged', onAccountChange);
        getEthereumContext()?.on('chainChanged', onNetworkChange);
      } else {
        void disconnect().then(() => {
          getEthereumContext()?.off('accountsChanged', onAccountChange);
          getEthereumContext()?.off('chainChanged', onNetworkChange);
        });
      }
    },
    [disconnect, onNetworkChange]
  );

  const connect = useCallback(async () => {
    const ctx = getEthereumContext();
    if (!ctx) throw new Error('No injected wallets found');

    web3 = new Web3();
    const zkSyncPlugin = new ZKsyncPlugin(ctx);
    web3.registerPlugin(zkSyncPlugin);
    const l2 = web3.ZKsync.L2;

    const accounts = await l2.eth.requestAccounts();

    if (accounts.length === 0) {
      throw new Error('No accounts found');
    }

    const chainId = await l2.eth.getChainId();

    onAccountChange(accounts);

    if (chainId) onNetworkChange(web3.utils.toHex(chainId));
  }, [onAccountChange, onNetworkChange]);

  useEffect(() => {
    void connect();

    return () => {
      void disconnect().then(() => {
        getEthereumContext()?.off('accountsChanged', onAccountChange);
        getEthereumContext()?.off('chainChanged', onNetworkChange);
      });
    };
  }, [connect, disconnect, onAccountChange, onNetworkChange]);

  const switchNetwork = useCallback(async (chainId: string) => {
    const chain = chains.find((chain: Chain) => chain.id === chainId);

    if (!chain) throw new Error('Unsupported chain');

    const hexChainId = web3?.utils.numberToHex(chainId);

    const ctx = getEthereumContext();

    if (hexChainId) {
      try {
        await ctx?.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: hexChainId }],
        });
      } catch (error) {
        if ((error as ProviderError)?.code === 4902) {
          ctx?.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: hexChainId,
                rpcUrls: [chain.rpcUrl],
                chainName: chain.name,
                nativeCurrency: {
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18,
                },
                blockExplorerUrls: chain.blockExplorerUrl ? [chain.blockExplorerUrl] : null,
              },
            ],
          });
        }
      }
    }
  }, []);

  const getWeb3 = () => web3;

  return (
    <EthereumContext.Provider
      value={{
        account,
        network,
        switchNetwork,
        connect,
        disconnect: () => onAccountChange([]),
        getWeb3,
      }}
    >
      {children}
    </EthereumContext.Provider>
  );
};
