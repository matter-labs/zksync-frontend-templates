<script lang="ts">
  import { etherStore } from "../ethers";

  $: ({ account } = $etherStore);
</script>

{#if account.isConnected}
  <slot />
{/if}
