<script>
  import DummyAudio from '../components/DummyAudio.svelte'
  import Timer from '../components/Timer.svelte'
  import AudioIcon from '../components/AudioIcon.svelte'
  import BaseButton from '../components/BaseButton.svelte'

  import { onMount } from 'svelte'
  import { mockAnkidroid } from '../utils/mock'
  import { loadPersistence } from '../utils/persistence'

  const isDev = process.env.NODE_ENV === 'development'

  let hintVisible = false
  let pronAudio = null
  let sentenceAudio = null

  function handleShowAnswer(state) {
    setState(state)
    window.showAnswer()
  }

  function handleHintClick() {
    hintVisible = true
    sentenceAudio.play()
  }

  // state: easy: 4, good: 3, hard: 2, bad: 1
  function setState(state) {
    if (!Persistence.isAvailable) return
    Persistence.setItem(state)
  }

  onMount(() => {
    isDev && mockAnkidroid()
    loadPersistence()

    // Init Ankidroid Javascript API
    AnkiDroidJS.init(
      JSON.stringify({
        version: '0.0.1',
        developer: 'dev@mail.com',
      })
    )

    pronAudio.play()
  })
</script>

{#if isDev}
  <DummyAudio />
{/if}

<!-- <svelte:window on:DOMContentLoaded={initAudio} /> -->

<div
  class="flex flex-col items-center bg-white dark:bg-gray-900"
  id="front"
>
  <div class="w-full">
    <div class="w-full flex justify-around text-center p-3">
      <div>
        <div class="text-gray-400 dark:text-gray-300">待学习</div>
        <div
          class="text-gray-600 dark:text-gray-300"
          id="newCardCount"
        >
          0
        </div>
      </div>
      <div>
        <div class="text-gray-400 dark:text-gray-300">待复习</div>
        <div
          class="text-gray-600 dark:text-gray-300"
          id="learnCardCount"
        >
          0
        </div>
      </div>
      <div>
        <div class="text-gray-400 dark:text-gray-300">剩余时间</div>
        <div class="text-gray-600 dark:text-gray-300" id="ETA">
          0min
        </div>
      </div>
    </div>
    <Timer />
  </div>
  <div
    class="flex-grow flex flex-col justify-between pt-28 relative w-full"
  >
    <div class="space-y-16">
      <div id="word" class="text-5xl text-center dark:text-gray-100">
        {@html '{{单词}}'}
      </div>
      <div
        on:click={() => pronAudio.play()}
        class="cursor-pointer flex items-center justify-center space-x-2"
      >
        <AudioIcon
          bind:this={pronAudio}
          targetSelector=".pronAudioWrap .replaybutton"
          className="pronounceIcon"
        />
        <span class="text-gray-400 dark:text-gray-100"
          >{@html '{{音标}}'}</span
        >
      </div>
      <div
        class="px-4"
        id="sentenceHint"
        style={`visibility: ${
          hintVisible ? 'visibility' : 'hidden'
        };`}
      >
        <div
          class="flex space-x-3 bg-gray-100 dark:bg-gray-800 p-4 rounded-md"
        >
          <div class="whitespace-nowrap">
            <span
              class="bg-white py-1 px-3 rounded-full text-sm text-gray-400 dark:text-gray-300 dark:bg-gray-700"
              >例句</span
            >
          </div>
          <div class="dark:text-gray-100">
            <p id="sentence-en" lang="en" class="leading-6">
              {@html '{{例句英文}}'}
            </p>
          </div>
          <div
            on:click={() => sentenceAudio.play()}
            class="relative top-0.5"
          >
            <AudioIcon
              bind:this={sentenceAudio}
              targetSelector=".sentenceAudioWrap .replaybutton"
              className="pronounceIcon"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="w-full px-12 pb-6">
      <div class="flex flex-col space-y-3">
        {#if !hintVisible}
          <BaseButton
            on:click={() => handleShowAnswer(3)}
            type="primary">我认识</BaseButton
          >
          <BaseButton on:click={handleHintClick} type="secondly"
            >提示一下</BaseButton
          >
        {:else}
          <BaseButton
            on:click={() => handleShowAnswer(2)}
            type="primary">想起来了</BaseButton
          >
          <BaseButton
            on:click={() => handleShowAnswer(1)}
            type="secondly">没想起来</BaseButton
          >
        {/if}
      </div>
    </div>
    <div
      on:click={() => handleShowAnswer(4)}
      class="cursor-pointer bg-gray-100 dark:bg-gray-800 dark:text-gray-500 absolute right-0 top-6 flex p-2 rounded-l-full text-gray-300 text-sm"
    >
      <span
        ><svg
          t="1620033709442"
          class="icon fill-current h-5"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4549"
          ><path
            d="M735.573333 354.901333a83.456 83.456 0 0 1 73.301334 77.44c7.808 132.010667-9.898667 264.32-53.248 396.842667a84.778667 84.778667 0 0 1-70.570667 57.685333 1262.037333 1262.037333 0 0 1-303.616-0.042666 84.778667 84.778667 0 0 1-70.4-57.429334c-43.690667-132.010667-61.141333-264.362667-53.162667-397.056 2.389333-40.106667 33.706667-72.661333 73.301334-77.44a1676.330667 1676.330667 0 0 1 404.352 0zM533.333333 128c58.88 0 107.861333 30.378667 116.522667 69.930667a1798.4 1798.4 0 0 1 134.186667 13.866666 31.317333 31.317333 0 0 1 26.624 31.061334v28.416a31.146667 31.146667 0 0 1-31.018667 31.232 1409.706667 1409.706667 0 0 0-492.629333 0A31.146667 31.146667 0 0 1 256 271.274667v-28.373334c0-15.530667 11.392-28.970667 26.709333-31.104a1803.093333 1803.093333 0 0 1 134.101334-13.866666C425.472 158.378667 474.453333 128 533.333333 128z m0 36.778667c-28.373333 0-52.608 12.714667-61.610666 30.421333a1746.346667 1746.346667 0 0 1 123.136-0.042667c-8.96-17.664-33.152-30.378667-61.525334-30.378666z"
            p-id="4550"
          /></svg
        ></span
      >
      <span>标记为太简单</span>
    </div>
  </div>
</div>
