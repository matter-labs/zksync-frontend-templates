import IERC20 from "zksync-web3/abi/IERC20.json";

export const erc20ABI = IERC20.abi;

export const daiContractConfig = {
  address: '0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b', // zkSync Era Goerli Testnet DAI token address
  abi: erc20ABI,
} as const
