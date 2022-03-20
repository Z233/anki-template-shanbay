<script>
  import { setContext, onMount } from 'svelte'
  import { initAnkiDroid } from '../utils/ankiDroid'
  import { getFields } from '../utils/helper'
  import { readable } from 'svelte/store'
  import { isDev } from '../utils/helper'

  import DummyTemplate from '../components/DummyTemplate.svelte'

  let isFront = true

  const cardStore = readable({}, (set) => {
    onMount(() => {
      set(getFields())
    })
  })

  setContext('card', {
    cardStore: cardStore,
    showAnswer: showAnswer,
    nextCard: nextCard,
  })

  // state: easy: 4, good: 3, hard: 2, bad: 1
  let state = 3
  setContext('state', [() => state, (val) => (state = val)])

  function showAnswer() {
    isFront = false
  }

  function nextCard() {
    Persistence.setItem(`signal:answer_ease${state}`)
    console.log(Persistence.getItem())
    window.showAnswer()
  }

  onMount(() => {
    initAnkiDroid()
  })
</script>

{#if isDev}
  <DummyTemplate />
{/if}

<slot {isFront} />
