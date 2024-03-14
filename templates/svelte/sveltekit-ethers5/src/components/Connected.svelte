<script lang="ts">
  import { etherStore } from "../stores/ethers";

  $: ({ account } = $etherStore);
</script>

{#if account.isConnected}
  <slot />
{/if}
