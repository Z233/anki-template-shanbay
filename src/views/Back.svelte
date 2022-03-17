<script>
  import AudioIcon from '../components/AudioIcon.svelte'
  import DummyAudio from '../components/DummyTemplate.svelte'
  import Dots from '../components/Dots.svelte'
  import BaseButton from '../components/BaseButton.svelte'

  import { onMount } from 'svelte'
  import { initAnkiDroid } from '../utils/ankiDroid'
  import { getFields, isDev } from '../utils/helper'

  let pronAudio = null
  let sentenceAudio = null
  let dotsVisible = false
  let state = 3
  let card = {}

  const answerActions = {
    4: {
      fn: () => buttonAnswerEase4(),
      dotsClassName: 'bg-green-500 dark:bg-green-700',
    },
    3: {
      fn: () => buttonAnswerEase3(),
      dotsClassName: 'bg-primary dark:bg-primary-dark',
    },
    2: {
      fn: () => buttonAnswerEase2(),
      dotsClassName: 'bg-secondly dark:bg-secondly-dark',
    },
    1: {
      fn: () => buttonAnswerEase1(),
      dotsClassName: 'bg-red-500 dark:bg-red-700',
    },
  }

  function handleNextCard() {
    dotsVisible = true
    setTimeout(() => {
      answerActions[state].fn()
    }, 200)
  }

  function handleWrongAnswer() {
    state = 1
    handleNextCard()
  }

  onMount(() => {
    initAnkiDroid()

    card = getFields()

    pronAudio.play().then(() => {
      sentenceAudio.play()
    })

    state = +Persistence.getItem()
  })
</script>

{#if isDev}
  <DummyAudio />
{/if}

<div
  class="flex flex-col h-full relative items-center bg-white dark:bg-gray-900"
  id="back"
>
  <div class="p-4 space-y-2 w-full">
    <div class="flex justify-between items-center">
      <div class="space-y-1 w-full">
        <div class="text-5xl flex justify-between">
          <span id="word" class="w-11/12 dark:text-gray-100"
            >{@html card.word}</span
          >
          <AudioIcon
            on:click={() => pronAudio.play()}
            bind:this={pronAudio}
            className="w-1/12"
            targetSelector="#pronAudioWrap .replaybutton"
          />
        </div>
        <div class="text-gray-400 dark:text-gray-300">
          {@html card.symbol}
        </div>
      </div>
    </div>
    <div class="leading-8 dark:text-gray-100">
      {@html card.definition}
    </div>
    <div class="w-full h-0.5 bg-gray-200 dark:bg-gray-700" />
    <div class="flex items-center justify-between">
      <span
        class="bg-gray-200 py-1 px-3 rounded-full text-sm text-gray-400 inline-block dark:text-gray-300 dark:bg-gray-700"
        >例句</span
      >
      <AudioIcon
        bind:this={sentenceAudio}
        targetSelector="#sentenceAudioWrap .replaybutton"
        className="w-6 h-6"
      />
    </div>
    <div class="leading-6">
      <p lang="en" id="sentence-en" class="dark:text-gray-100">
        {@html card.sentenceEn}
      </p>
      <p class="text-gray-400 mt-1 dark:text-gray-300">
        {@html card.sentenceCn}
      </p>
    </div>
  </div>
  <div
    class="w-full px-12 flex flex-col absolute bottom-6 
    space-y-3 items-center"
  >
    <Dots className={answerActions[state].dotsClassName} hidden={!dotsVisible} />
    <BaseButton
      on:click={handleNextCard}
      type="primary"
      className="w-full">下一个</BaseButton
    >
    <BaseButton
      on:click={handleWrongAnswer}
      type="error"
      className="w-full">记错了</BaseButton
    >
  </div>
</div>
