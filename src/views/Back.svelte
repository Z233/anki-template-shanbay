<script>
  import AudioIcon from '../components/AudioIcon.svelte'
  import DummyAudio from '../components/DummyAudio.svelte'

  import { onMount } from 'svelte'
  import { initAnkiDroid } from '../utils/ankiDroid'
  import { isDev } from '../utils/helper'

  let pronAudio = null
  let sentenceAudio = null

  function handleDOMContentLoaded() {
    pronAudio.play().then(() => {
      sentenceAudio.play()
    })

  }

  onMount(() => {
    initAnkiDroid()
  })
</script>

{#if isDev}
  <DummyAudio />
{/if}

<svelte:window on:DOMContentLoaded={handleDOMContentLoaded} />

<div
  class="flex flex-col h-full relative items-center bg-white dark:bg-gray-900"
  id="back"
>
  <div class="p-4 space-y-2 w-full">
    <div class="flex justify-between items-center">
      <div class="space-y-1 w-full">
        <div class="text-5xl flex justify-between">
          <span id="word" class="w-11/12 dark:text-gray-100"
            >{@html '{{单词}}'}</span
          >
          <AudioIcon
            on:click={() => pronAudio.play()}
            bind:this={pronAudio}
            className="w-1/12"
            targetSelector=".pronAudioWrap .replaybutton"
          />
        </div>
        <div class="text-gray-400 dark:text-gray-300">
          {@html '{{音标}}'}
        </div>
      </div>
    </div>
    <div class="leading-8 dark:text-gray-100">
      {@html '{{释义}}'}
    </div>
    <div class="w-full h-0.5 bg-gray-200 dark:bg-gray-700" />
    <div class="flex items-center justify-between">
      <span
        class="bg-gray-200 py-1 px-3 rounded-full text-sm text-gray-400 inline-block dark:text-gray-300 dark:bg-gray-700"
        >例句</span
      >
      <AudioIcon
        bind:this={sentenceAudio}
        targetSelector=".sentenceAudioWrap .replaybutton"
        className="w-6 h-6"
      />
    </div>
    <div class="leading-6">
      <p lang="en" id="sentence-en" class="dark:text-gray-100">
        {@html '{{例句英文}}'}
      </p>
      <p class="text-gray-400 mt-1 dark:text-gray-300">
        {@html '{{例句中文}}'}
      </p>
    </div>
  </div>
  <div
    class="w-full px-12 flex flex-col absolute bottom-6 space-y-3 items-center"
  >
    <div id="dotsWrap" class="abolute" />
    <button
      id="nextButton"
      class="w-full bg-primary dark:bg-primary-dark dark:text-gray-100 text-white p-3 rounded-full focus:outline-none select-none focus:ring-2"
      >下一个</button
    >
    <button
      id="wrongButton"
      class="w-full bg-red-600 dark:text-gray-100 dark:bg-red-800 text-white p-3 rounded-full focus:outline-none select-none focus:ring-2"
      >记错了</button
    >
  </div>
</div>
