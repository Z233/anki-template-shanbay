<script>
import Card from "./views/Card.svelte";
import Front from "./views/Front.svelte";
import Back from "./views/Back.svelte";

</script>

<Card let:isFront={isFront}>
  {#if isFront}
    <Front/>
  {:else}
    <Back/>
  {/if}
</Card>