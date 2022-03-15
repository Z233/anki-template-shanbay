<script>
  let timer = null
  let start = null
  const DURATION = 10000

  function step(timestamp) {
    if (start === undefined) start = timestamp
    const elapsed = timestamp - start
    timer.style.width =
      Math.min((100 / DURATION) * elapsed, 100) + '%'
    if (elapsed < DURATION) window.requestAnimationFrame(step)
  }
</script>

<svelte:window
  on:DOMContentLoaded={() => window.requestAnimationFrame(step)}
/>

<div class="w-full h-1 bg-gray-200 dark:bg-gray-700">
  <div
    bind:this={timer}
    class="bg-primary dark:bg-primary-dark h-full w-0"
  />
</div>
