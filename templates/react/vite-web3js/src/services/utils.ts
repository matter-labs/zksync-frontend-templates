import { Web3 } from 'web3';

export function formatBalance(balance: bigint) {
  return Web3.utils.fromWei(balance, 'ether');
}
