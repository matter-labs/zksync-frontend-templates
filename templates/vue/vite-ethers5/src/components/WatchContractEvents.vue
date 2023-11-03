<template>
  <div>
    <details>
      <summary>{{ events.length }} DAI `Transfer`s logged</summary>
      
      {{
        events
          .reverse()
          .map((log) => stringify(log))
          .join('\n\n\n\n')
      }}
    </details>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Contract } from 'zksync-web3';
import type { BigNumber } from 'ethers';

import { stringify } from '@/utils/formatters';
import { daiContractConfig } from '@/utils/contracts';
import { getProvider } from "@/ethers"

type TransferLog = {
  from: string;
  to: string;
  amount: BigNumber;
}
const events = ref<TransferLog[]>([]);

const contract = new Contract(daiContractConfig.address, daiContractConfig.abi, getProvider()!);
contract.on('Transfer', (from, to, amount, event) => {
  events.value.push({
    from,
    to,
    amount,
  });
});
</script>