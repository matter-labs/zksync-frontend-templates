<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <input v-model="amount" type="number" placeholder="Allowance Amount" />
      <button :disabled="isSimulating || isPending || !amount" type="submit">
        {{ isSimulating ? 'Simulating...' : isPending ? 'Confirming...' : 'Approve' }}
      </button>
    </form>
    <div v-if="simulateError">Simulation Error: {{ simulateError.message }}</div>
    <div v-if="isPending">Check wallet...</div>
    <div v-if="transactionHash">
      <div>Transaction Hash: {{ transactionHash }}</div>
      <div v-if="receipt">
        Transaction Receipt: <pre>{{ stringify(receipt, null, 2) }}</pre>
      </div>
    </div>
    <div v-if="error">Error: {{ error.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { BaseError } from 'viem';
import { simulateContract, writeContract as wagmiWriteContract, waitForTransactionReceipt } from '@wagmi/core';
import { stringify } from '@/utils/formatters';
import { daiContractConfig } from '@/utils/contracts';
import { wagmiConfig } from '../wagmi';

const amount = ref<string>('');
const isSimulating = ref(false);
const isPending = ref(false);
const transactionHash = ref<string | null>(null);
const receipt = ref<any>(null);
const simulateError = ref<Error | null>(null);
const error = ref<Error | null>(null);

const spender: `0x${string}` = '0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044';

const handleSubmit = async () => {
  if (!amount.value) return;

  try {
    isSimulating.value = true;
    const simulation = await simulateContract(wagmiConfig, {
      abi: daiContractConfig.abi,
      address: daiContractConfig.address,
      functionName: 'approve',
      args: [spender, BigInt(amount.value)],
    });

    isSimulating.value = false;

    if (simulation.result) {
      isPending.value = true;
      const result = await wagmiWriteContract(wagmiConfig, {
        abi: daiContractConfig.abi,
        address: daiContractConfig.address,
        functionName: 'approve',
        args: [spender, BigInt(amount.value)],
      });

      transactionHash.value = result;

      const transactionReceipt = await waitForTransactionReceipt(wagmiConfig, { hash: result });
      receipt.value = transactionReceipt;
    }
  } catch (e: any) {
    if (isSimulating.value) {
      simulateError.value = e instanceof BaseError ? e : null;
    } else {
      error.value = e instanceof BaseError ? e : null;
    }
  } finally {
    isSimulating.value = false;
    isPending.value = false;
  }
};

</script>
