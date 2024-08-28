import { useState, FormEvent, useCallback } from 'react';
import { useEthereum } from '@/services/ethereum/context.ts';
import { useAsync } from '@/hooks/use-async.ts';

export function SignMessage() {
  const { account, getZKsync } = useEthereum();
  const zkSync = getZKsync();

  const [message, setMessage] = useState('');

  const asyncFetch = useCallback(async () => {
    if (!zkSync || !account.address || !message) throw new Error('Signer not found or message is empty.');

    const signature = await zkSync.L2.eth.personal.sign(message, account.address, '');
    const recoveredAddress = account.address;
    return {
      signature,
      recoveredAddress,
    };
  }, [message, zkSync]);

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
