<script lang="ts">
  import { recoverMessageAddress } from "viem";
  import { signMessage as wagmiSignMessage } from "@wagmi/core";
  import { useAsync } from "../composables/useAsync";

  let message: string | null = null;

  const { state, execute: signMessage } = useAsync(async () => {
    const signature = await wagmiSignMessage({ message: message! });
    const recoveredAddress = await recoverMessageAddress({
      message: message!,
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
