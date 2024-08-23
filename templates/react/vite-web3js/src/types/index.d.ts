declare global {
  interface Window {
    ethereum: import('web3').EIP1193Provider;
  }

  interface BigInt {
    toJSON: () => string;
  }
}

export {};
