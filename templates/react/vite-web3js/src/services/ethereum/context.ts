import { createContext, useContext } from 'react';
import type { EthereumContextValue } from '@/services/ethereum/types.ts';

export const EthereumContext = createContext<EthereumContextValue | null>(null);

export const useEthereum = () => {
  const context = useContext(EthereumContext);

  if (!context) {
    throw new Error('useEthereum must be used within an EthereumProvider');
  }

  return context;
};
