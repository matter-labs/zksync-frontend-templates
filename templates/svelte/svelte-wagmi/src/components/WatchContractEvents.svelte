<script lang="ts">
  import type { Log } from "viem";
  import { watchContractEvent } from "@wagmi/core";
  import { daiContractConfig } from "../utils/contracts";
  import { stringify } from "../utils/formatters";

  let events: Log[] = [];

  watchContractEvent(
    {
      ...daiContractConfig,
      eventName: "Transfer",
    },
    (logs) => {
      events = [...events, ...logs];
    }
  );
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
