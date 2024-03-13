<script lang="ts">
  import { Contract } from "zksync-ethers";
  import { etherStore } from "../ethers";
  import { daiContractConfig } from "../utils/contracts";
  import { stringify } from "../utils/formatters";

  const { getProvider } = etherStore;

  type TransferLog = {
    from: string;
    to: string;
    amount: BigInt;
  };
  let events: TransferLog[] = [];

  const contract = new Contract(
    daiContractConfig.address,
    daiContractConfig.abi,
    getProvider()!,
  );
  contract.on("Transfer", (from, to, amount, event) => {
    events = [
      ...events,
      {
        from,
        to,
        amount,
      },
    ];
  });
</script>

<div>
  <details>
    <summary>{events.length} DAI `Transfer`s logged</summary>

    {events
      .reverse()
      .map((log) => stringify(log))
      .join("\n\n\n\n")}
  </details>
</div>
