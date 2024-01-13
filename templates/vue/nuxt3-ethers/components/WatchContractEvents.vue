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
import { Contract } from 'zksync-ethers';

const { getProvider } = useEthers()

type TransferLog = {
  from: string;
  to: string;
  amount: BigInt;
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