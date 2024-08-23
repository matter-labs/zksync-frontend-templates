import { useEthereum } from '@/services/ethereum/context';

export function Account() {
  const { account } = useEthereum();

  return <div>{account.address}</div>;
}
