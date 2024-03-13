<script lang="ts">
  import { wagmiStore } from "../stores/wagmi";
</script>

<div>
  {$wagmiStore.account.address}
</div>
