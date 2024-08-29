'use client'

import { useState, FormEvent } from 'react';

import { useAsync } from '../hooks/useAsync';
import { useEthereum } from './Context';

export function SignMessage() {
  const [message, setMessage] = useState('');
  const { account, getZKsync } = useEthereum();
  const zkSync = getZKsync();
  const { result, execute: signMessage, inProgress, error } = useAsync(async () => {
    if (zkSync && message && account.address) {
      const signature = await zkSync.L2.eth.personal.sign(message, account.address, "");
    const recoveredAddress = account.address;
      return {
        signature,
        recoveredAddress,
      };
    }
    throw new Error('Signer not found or message is empty.');
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    signMessage();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          required
        />
        <button type="submit">Sign Message</button>
      </form>

      {!inProgress && result && (
        <div>
          <div>Signature: {result.signature}</div>
          <div>Recovered address: {result.recoveredAddress}</div>
        </div>
      )}

      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
