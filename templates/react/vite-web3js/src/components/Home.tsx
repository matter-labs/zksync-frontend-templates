import { Connect } from '@/components/Connect.tsx';
import { Account } from '@/components/Account.tsx';
import { Balance } from '@/components/Balance.tsx';
import { NetworkSwitcher } from '@/components/NetworkSwitcher.tsx';
import { BlockNumber } from '@/components/BlockNumber.tsx';
import { ReadContract } from '@/components/ReadContract.tsx';
import { SendTransaction } from '@/components/SendTransaction.tsx';
import { SendTransactionPrepared } from '@/components/SendTransactionPrepared.tsx';
import { SignMessage } from '@/components/SignMessage.tsx';
import { SignTypedData } from '@/components/SignTypedData.tsx';
import { Token } from '@/components/Token.tsx';
import { WatchContractEvents } from '@/components/WatchContractEvents.tsx';
import { WatchPendingTransactions } from '@/components/WatchPendingTransactions.tsx';
import { WriteContract } from '@/components/WriteContract.tsx';
import { WriteContractPrepared } from '@/components/WriteContractPrepared.tsx';
import { useEthereum } from '@/services/ethereum/context.ts';
import styles from '@/styles/home.module.css';

export function Home() {
  const { account } = useEthereum();

  return (
    <main className={styles.home}>
      <div>
        <Connect />
        {account.isConnected && (
          <>
            <hr />
            <h2>Network</h2>
            <p>
              <strong>
                Make sure to connect your wallet to zkSync Testnet for full functionality
              </strong>
              <br />
              or update to a different contract address
            </p>
            <NetworkSwitcher />
            <br />
            <hr />
            <h2>Account</h2>
            <Account />
            <br />
            <hr />
            <h2>Balance</h2>
            <Balance />
            <br />
            <hr />
            <h2>Block Number</h2>
            <BlockNumber />
            <br />
            <hr />
            <h2>Read Contract</h2>
            <ReadContract />
            <br />
            <hr />
            <h2>Send Transaction</h2>
            <SendTransaction />
            <br />
            <hr />
            <h2>Send Transaction (Prepared)</h2>
            <SendTransactionPrepared />
            <br />
            <hr />
            <h2>Sign Message</h2>
            <SignMessage />
            <br />
            <hr />
            <h2>Sign Typed Data</h2>
            <SignTypedData />
            <br />
            <hr />
            <h2>Token</h2>
            <Token />
            <br />
            <hr />
            <h2>Watch Contract Events</h2>
            <WatchContractEvents />
            <br />
            <hr />
            <WatchPendingTransactions />
            <br />
            <hr />
            <h2>Write Contract</h2>
            <WriteContract />
            <br />
            <hr />
            <h2>Write Contract (Prepared)</h2>
            <WriteContractPrepared />
          </>
        )}
      </div>
    </main>
  );
}
