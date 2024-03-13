<script lang="ts">
  import { ethers } from "ethers";
  import { etherStore } from "../ethers";
  import { useAsync } from "../composables/useAsync";

  const { getSigner } = etherStore;

  let message: string | null = null;

  const { state, execute: signMessage } = useAsync(async () => {
    const signature = await (await getSigner())!.signMessage(message!);
    const recoveredAddress = ethers.verifyMessage(message!, signature);

    return {
      signature,
      recoveredAddress,
    };
  });
  $: ({ result, inProgress, error } = $state);
</script>

<div>
  <form on:submit|preventDefault={signMessage}>
    <input bind:value={message} placeholder="message" required />
    <button type="submit">Sign Message</button>
  </form>

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
