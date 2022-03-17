<script>
  export let className = 'bg-primary'
  export let hidden = true

  const DOT_NUM = 3
</script>

<div class="space-x-1" {hidden}>
  {#each Array(DOT_NUM) as _}
    <span
      class={`${className} inline-block w-1.5 h-1.5 rounded-full`}
    />
  {/each}
</div>
