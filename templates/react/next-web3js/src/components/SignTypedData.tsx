'use client'

// import { ethers, type TypedDataField } from 'ethers';

import { useAsync } from '../hooks/useAsync';
import { defaultChain, useEthereum } from './Context';

const domain = {
  name: 'Ether Mail',
  version: '1',
  chainId: defaultChain.id,
  verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
} as const

const types = {
    EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
  Person: [
    { name: 'name', type: 'string' },
    { name: 'wallet', type: 'address' },
  ],
  Mail: [
    { name: 'from', type: 'Person' },
    { name: 'to', type: 'Person' },
    { name: 'contents', type: 'string' },
  ],
}

const message = {
  from: {
    name: 'Cow',
    wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
  },
  to: {
    name: 'Bob',
    wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
  },
  contents: 'Hello, Bob!',
} as const

export function SignTypedData() {
  const { getWeb3 } = useEthereum();
    const web3 = getWeb3();
  const { result, execute: signTypedData, inProgress, error } = useAsync(async () => {
    if (web3){
        const accounts = await web3.eth.getAccounts();
        const signature = await web3.eth.signTypedData(accounts[0], {domain, types, message, 
            primaryType: 'Mail',});

        return {
            signature,
            recoveredAddress: accounts[0],
            };
    }
    throw new Error('Signer not found or message is empty.');
  });

  return (
    <div>
      <button type="submit" onClick={signTypedData}>Sign Typed Data</button>

      {result && !inProgress && (
        <div>
          <div>Signature: {result.signature}</div>
          <div>Recovered address: {result.recoveredAddress}</div>
        </div>
      )}

      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
