<script>
  import { onMount } from 'svelte'

  let newCardCount = 0
  let learnCardCount = 0
  let estimatedMinutes = 0

  onMount(() => {
    newCardCount = +AnkiDroidJS.ankiGetNewCardCount()
    learnCardCount =
      parseInt(AnkiDroidJS.ankiGetLrnCardCount(), 10) +
      parseInt(AnkiDroidJS.ankiGetRevCardCount(), 10)

    estimatedMinutes = +AnkiDroidJS.ankiGetETA()
  })
</script>

<div class="w-full flex justify-around text-center p-3">
  <div>
    <div class="text-gray-400 dark:text-gray-300">待学习</div>
    <div class="text-gray-600 dark:text-gray-300">
      {newCardCount}
    </div>
  </div>
  <div>
    <div class="text-gray-400 dark:text-gray-300">待复习</div>
    <div class="text-gray-600 dark:text-gray-300">
      {learnCardCount}
    </div>
  </div>
  <div>
    <div class="text-gray-400 dark:text-gray-300">剩余时间</div>
    <div class="text-gray-600 dark:text-gray-300">
      {estimatedMinutes}min
    </div>
  </div>
</div>
