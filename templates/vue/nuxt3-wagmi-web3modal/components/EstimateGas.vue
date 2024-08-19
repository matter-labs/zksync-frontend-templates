<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <input
        v-model="to"
        placeholder="Address"
        type="text"
      />
      <input
        v-model="value"
        placeholder="Value (ether)"
        type="text"
      />
      <button :disabled="isSending || !to || !value" type="submit">
        {{ isSending ? 'Confirming...' : 'Send' }}
      </button>
    </form>

    <div v-if="estimatedGas">Estimated Gas: {{ estimatedGas }}</div>
    <div v-if="transactionHash">Transaction Hash: {{ transactionHash }}</div>
    <div v-if="isConfirming">Waiting for confirmation...</div>
    <div v-if="isConfirmed">Transaction confirmed.</div>
    <div v-if="sendError || receiptError">
      Error: {{ (sendError || receiptError)?.message }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { parseEther } from 'viem';
import { estimateGas, sendTransaction, waitForTransactionReceipt } from '@wagmi/core';
import { wagmiConfig } from '../store/wagmi.js';

const to = ref('');
const value = ref('');
const estimatedGas = ref<bigint | undefined>(undefined);
const transactionHash = ref<string | undefined>(undefined);
const isSending = ref(false);
const isConfirming = ref(false);
const isConfirmed = ref(false);
const sendError = ref<Error | null>(null);
const receiptError = ref<Error | null>(null);

const handleSubmit = async () => {
  if (to.value && value.value) {
    isSending.value = true;
    try {
      const gasEstimate = await estimateGas(wagmiConfig, {
        to: to.value as `0x${string}`,
        value: parseEther(value.value),
      });
      estimatedGas.value = gasEstimate;

      const hash = await sendTransaction(wagmiConfig, {
        to: to.value as `0x${string}`,
        value: parseEther(value.value),
        gas: gasEstimate,
      });

      transactionHash.value = hash;

      isSending.value = false;
      isConfirming.value = true;
      await waitForTransactionReceipt(wagmiConfig, {
        hash: hash,
      });

      isConfirmed.value = true;
      isConfirming.value = false;
    } catch (error) {
      isSending.value = false;
      sendError.value = error as Error;
      console.error('Error estimating or sending transaction:', error);
    }
  }
};
</script>
