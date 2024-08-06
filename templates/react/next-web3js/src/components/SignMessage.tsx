'use client'

import { useState, FormEvent } from 'react';

import { useAsync } from '../hooks/useAsync';
import { useEthereum } from './Context';

export function SignMessage() {
  const [message, setMessage] = useState('');
  const { getWeb3 } = useEthereum();
  const web3 = getWeb3();
  const { result, execute: signMessage, inProgress, error } = useAsync(async () => {
    if (web3 && message) {
      const accounts = await web3.eth.getAccounts();
      const signature = await web3.eth.personal.sign(message, accounts[0], "");
    const recoveredAddress = accounts[0];
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
