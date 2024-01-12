<template>
  <div>
    <form @submit.prevent="signMessage">
      <input v-model="message" placeholder="message" required />
      <button type="submit">Sign Message</button>
    </form>

    <div v-if="result && !inProgress">
      <div>
        <div>Signature: {{ result.signature }}</div>
        <div>Recovered address: {{ result.recoveredAddress }}</div>
      </div>
    </div>

    <div v-if="error">Error: {{ error?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ethers } from 'ethers';

const { getSigner } = useEthers()

const message = ref<string | null>(null);

const { result, execute: signMessage, inProgress, error} = useAsync(async () => {
  const signature =  await (await getSigner())!.signMessage(message.value!);
  const recoveredAddress = ethers.verifyMessage(message.value!, signature)

  return {
    signature,
    recoveredAddress
  }
});
</script>