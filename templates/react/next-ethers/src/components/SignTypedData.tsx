'use client'

import { ethers, type TypedDataField } from 'ethers';

import { useAsync } from '../hooks/useAsync';
import { defaultChain, useEthereum } from './Context';

const domain = {
  name: 'Ether Mail',
  version: '1',
  chainId: defaultChain.id,
  verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
} as const

const types: Record<string, TypedDataField[]> = {
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
  const { getSigner } = useEthereum();

  const { result, execute: signTypedData, inProgress, error } = useAsync(async () => {
    const signature = await (await getSigner())!.signTypedData(domain, types, message);
    const recoveredAddress = ethers.verifyTypedData(domain, types, message, signature);

    return {
      signature,
      recoveredAddress
    };
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
