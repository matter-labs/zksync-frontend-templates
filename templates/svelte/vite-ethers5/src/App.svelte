<script lang="ts">
  import Account from "./components/Account.svelte";
  import Balance from "./components/Balance.svelte";
  import BlockNumber from "./components/BlockNumber.svelte";
  import Connect from "./components/Connect.svelte";
  import Connected from "./components/Connected.svelte";
  import FindBalance from "./components/FindBalance.svelte";
  import NetworkSwitcher from "./components/NetworkSwitcher.svelte";
  import ReadTokenBalance from "./components/ReadTokenBalance.svelte";
  import ReadTokenSupply from "./components/ReadTokenSupply.svelte";
  import SendTransaction from "./components/SendTransaction.svelte";
  import SendTransactionPrepared from "./components/SendTransactionPrepared.svelte";
  import SignMessage from "./components/SignMessage.svelte";
  import SignTypedData from "./components/SignTypedData.svelte";
  import Token from "./components/Token.svelte";
  import WatchContractEvents from "./components/WatchContractEvents.svelte";
  import WatchPendingTransactions from "./components/WatchPendingTransactions.svelte";
  import WriteContract from "./components/WriteContract.svelte";
  import WriteContractPrepared from "./components/WriteContractPrepared.svelte";
</script>

<div>
  <h1>zkSync + ethers 5 + Vite</h1>

  <Connect />

  <Connected>
    <hr />
    <h2>Network</h2>
    <p>
      <strong
        >Make sure to connect your wallet to zkSync Testnet for full
        functionality</strong
      >
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
    <FindBalance />
    <br />
    <hr />
    <h2>Block Number</h2>
    <BlockNumber />
    <br />
    <hr />
    <h2>Read Contract</h2>
    <ReadTokenBalance />
    <br />
    <ReadTokenSupply />
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
    <h2>Watch Pending Transactions</h2>
    <WatchPendingTransactions />
    <br />
    <hr />
    <h2>Write Contract</h2>
    <WriteContract />
    <br />
    <hr />
    <h2>Write Contract (Prepared)</h2>
    <WriteContractPrepared />
  </Connected>
</div>
