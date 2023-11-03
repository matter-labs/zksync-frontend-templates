import { erc20ABI } from 'wagmi'

export const usdcContractConfig = {
  address: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4', // zkSync Era Mainnet USDC token address
  abi: erc20ABI,
} as const
