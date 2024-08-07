import { Home } from '@/components/Home.tsx';
import { EthereumContextProvider } from '@/services/ethereum/EthereumContext.tsx';

export function App() {
  return (
    <EthereumContextProvider>
      <Home />
    </EthereumContextProvider>
  );
}
