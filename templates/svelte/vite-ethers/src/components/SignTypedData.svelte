<script lang="ts">
  import { ethers } from "ethers";
  import { defaultChain, etherStore } from "../ethers";
  import { useAsync } from "../composables/useAsync";

  const { getSigner } = etherStore;

  const domain = {
    name: "Ether Mail",
    version: "1",
    chainId: defaultChain.id,
    verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
  } as const;

  const types: Record<string, ethers.TypedDataField[]> = {
    Person: [
      { name: "name", type: "string" },
      { name: "wallet", type: "address" },
    ],
    Mail: [
      { name: "from", type: "Person" },
      { name: "to", type: "Person" },
      { name: "contents", type: "string" },
    ],
  };

  const message = {
    from: {
      name: "Cow",
      wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
    },
    to: {
      name: "Bob",
      wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
    },
    contents: "Hello, Bob!",
  } as const;

  const { state, execute: signTypedData } = useAsync(async () => {
    const signature = await (await getSigner())!.signTypedData(
      domain,
      types,
      message,
    );
    const recoveredAddress = ethers.verifyTypedData(
      domain,
      types,
      message,
      signature,
    );

    return {
      signature,
      recoveredAddress,
    };
  });
  $: ({ result, inProgress, error } = $state);
</script>

<div>
  <button type="submit" on:click={signTypedData}>Sign Typed Data</button>

  {#if result && !inProgress}
    <div>
      <div>Signature: {result.signature}</div>
      <div>Recovered address: {result.recoveredAddress}</div>
    </div>
  {/if}

  {#if error}
    <div>Error: {error?.message}</div>
  {/if}
</div>
