'use client'

import { erc20Abi } from 'viem'

export const daiContractConfig = {
  address: '0x6Ff473f001877D553833B6e312C89b3c8fACa7Ac', // zkSync Era Sepolia Testnet DAI token address
  abi: erc20Abi,
} as const
