<template>
  <div>
    <div>
      Connected to {{ network?.name ?? network?.id }}
      <span v-if="network?.unsupported">(unsupported)</span>
    </div>
    <br />
    <div>
      Switch to:
      <button v-for="(item, index) in chains" :key="index" @click="switchNetwork(item.id)">
        {{ item.name }}
      </button>
    </div>

    <div v-if="error">Error: {{ error?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { chains } from "@/store/ethers";

const { switchNetwork: switchToChainByID } = useEthers();
const { network } = storeToRefs(useEthers());
const { execute: switchNetwork, inProgress, error} = useAsync(switchToChainByID);
</script>