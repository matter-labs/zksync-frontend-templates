import IERC20 from "zksync-web3/build/abi/IERC20.json";

export const erc20ABI = IERC20.abi;

export const usdcContractConfig = {
  address: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4', // zkSync Era Mainnet USDC token address
  abi: erc20ABI,
} as const
