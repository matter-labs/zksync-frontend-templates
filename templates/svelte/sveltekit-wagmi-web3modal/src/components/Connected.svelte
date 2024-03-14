<script lang="ts">
  import { wagmiStore } from "../stores/wagmi";
  $: ({ account } = $wagmiStore);
</script>

{#if account.isConnected}
  <slot />
{/if}
