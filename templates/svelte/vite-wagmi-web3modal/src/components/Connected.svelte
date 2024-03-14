<script lang="ts">
  import { wagmiStore } from "../wagmi";
  $: ({ account } = $wagmiStore);
</script>

{#if account.isConnected}
  <slot />
{/if}
