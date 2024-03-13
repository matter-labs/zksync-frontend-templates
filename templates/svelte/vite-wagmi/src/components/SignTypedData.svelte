<script lang="ts">
  import { recoverTypedDataAddress } from "viem";
  import { signTypedData as wagmiSignTypedData } from "@wagmi/core";
  import { useAsync } from "../composables/useAsync";
  import { defaultChain } from "../wagmi";

  const domain = {
    name: "Ether Mail",
    version: "1",
    chainId: defaultChain.id,
    verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
  } as const;

  const types = {
    Person: [
      { name: "name", type: "string" },
      { name: "wallet", type: "address" },
    ],
    Mail: [
      { name: "from", type: "Person" },
      { name: "to", type: "Person" },
      { name: "contents", type: "string" },
    ],
  } as const;

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
    const signature = await wagmiSignTypedData({
      domain,
      types,
      message,
      primaryType: "Mail",
    });
    const recoveredAddress = await recoverTypedDataAddress({
      domain,
      types,
      message,
      primaryType: "Mail",
      signature,
    });

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
