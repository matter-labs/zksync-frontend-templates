import IERC20 from "zksync-ethers/abi/IERC20.json";

export const erc20ABI = IERC20;

export const daiContractConfig = {
  address: "0x604F0416e788779edB06c1A74a75FAad38384C6E", // zkSync Era Sepolia Testnet DAI token address
  abi: erc20ABI,
} as const;
