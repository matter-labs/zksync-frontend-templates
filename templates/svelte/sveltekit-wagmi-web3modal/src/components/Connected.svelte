<script lang="ts">
  import { wagmiStore } from "../stores/wagmi";
  $: ({ account } = $wagmiStore);
  $: console.log(account.isConnected);
</script>

{#if account.isConnected}
  <slot />
{/if}
