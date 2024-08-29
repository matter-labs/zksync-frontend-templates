import { type ReactNode, useState, useEffect, useCallback } from 'react';
import { hexToNumber, numberToHex, toHex } from 'web3-utils';
import { ZKsyncPlugin } from 'web3-plugin-zksync';
import type { Chain } from '@/types/web3.ts';
import { Account, Network } from './types.ts';
import { chains } from '../constants.ts';
import { EthereumContext } from './context.ts';

let zkSyncPlugin: ZKsyncPlugin | null = null;

export const EthereumContextProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<Account>({ isConnected: false, address: null });
  const [network, setNetwork] = useState<Network>(null);

  const getEthereumContext = () => window.ethereum;

  const onNetworkChange = useCallback((chainId: string) => {
    const strChainId = String(hexToNumber(chainId));
    const currentChain = chains.find((chain: Chain) => chain.id === strChainId);

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

    zkSyncPlugin = new ZKsyncPlugin(ctx);

    const accounts = await zkSyncPlugin.L2.eth.requestAccounts();

    if (accounts.length === 0) {
      throw new Error('No accounts found');
    }

    const chainId = await zkSyncPlugin.L2.eth.getChainId();

    onAccountChange(accounts);

    if (chainId) onNetworkChange(toHex(chainId));
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

    const hexChainId = numberToHex(chainId);

    const ctx = getEthereumContext();

    if (hexChainId) {
      try {
        await ctx?.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: hexChainId }],
        });
      } catch (error) {
        if ((error as any)?.code === 4902) { // 4902 - chain not added
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

  const getZKsync = () => zkSyncPlugin;

  return (
    <EthereumContext.Provider
      value={{
        account,
        network,
        switchNetwork,
        connect,
        disconnect: () => onAccountChange([]),
        getZKsync,
      }}
    >
      {children}
    </EthereumContext.Provider>
  );
};
