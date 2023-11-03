<template>
  <div>
    <div>
      Connected to {{network.chain?.name ?? network.chain?.id}}
      <span v-if="network.chain?.unsupported">(unsupported)</span>
    </div>
    <br />
    <div>
      Switch to:
      <button v-for="(item, index) in network.chains" :key="index" @click="switchNetwork({chainId: item.id})">
        {{ item.name }}
      </button>
    </div>

    <div v-if="error">Error: {{ error?.message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { switchNetwork as wagmiSwitchNetwork } from '@wagmi/core';

const { network } = storeToRefs(useWagmi());

const { execute: switchNetwork, inProgress, error} = useAsync(wagmiSwitchNetwork);
</script>