import { useState, FormEvent, useCallback } from 'react';
import { useEthereum } from '@/services/ethereum/context.ts';
import { useAsync } from '@/hooks/use-async.ts';

export function SignMessage() {
  const { getWeb3 } = useEthereum();
  const web3 = getWeb3();

  const [message, setMessage] = useState('');

  const asyncFetch = useCallback(async () => {
    if (!web3 || !message) throw new Error('Signer not found or message is empty.');

    const accounts = await web3.eth.getAccounts();
    const signature = await web3.eth.personal.sign(message, accounts[0], '');
    const recoveredAddress = accounts[0];
    return {
      signature,
      recoveredAddress,
    };
  }, [message, web3]);

  const { result, execute: signMessage, inProgress, error } = useAsync(asyncFetch);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void signMessage();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Message'
          required
        />{' '}
        <button type='submit'>Sign Message</button>
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
