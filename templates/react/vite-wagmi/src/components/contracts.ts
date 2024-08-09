'use client'

import { erc20Abi } from 'viem'

export const daiContractConfig = {
  address: "0x604F0416e788779edB06c1A74a75FAad38384C6E", // zkSync Era Sepolia Testnet DAI token address
  abi: erc20Abi,
} as const