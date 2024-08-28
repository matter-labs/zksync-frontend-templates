import { fromWei } from 'web3-utils';

export function formatBalance(balance: bigint) {
  return fromWei(balance, 'ether');
}
