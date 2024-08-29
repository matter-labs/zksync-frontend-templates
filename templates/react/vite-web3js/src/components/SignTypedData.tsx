import { defaultChain } from '@/services/constants.ts';
import { useEthereum } from '@/services/ethereum/context.ts';
import { useAsync } from '@/hooks/use-async.ts';
import { useCallback } from 'react';

const domain = {
  name: 'Ether Mail',
  version: '1',
  chainId: defaultChain.id,
  verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
} as const;

const types = {
  EIP712Domain: [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
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
};

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
} as const;

export function SignTypedData() {
  const { account, getZKsync } = useEthereum();
  const zkSync = getZKsync();

  const asyncFetch = useCallback(async () => {
    if (!zkSync || !account.address) throw new Error('Signer not found or message is empty.');

    const signature = await zkSync.L2.eth.signTypedData(account.address, {
      domain,
      types,
      message,
      primaryType: 'Mail',
    });

    return {
      signature,
      recoveredAddress: account.address,
    };
  }, [zkSync]);

  const { result, execute: signTypedData, inProgress, error } = useAsync(asyncFetch);

  return (
    <div>
      <button type='submit' onClick={signTypedData}>
        Sign Typed Data
      </button>

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