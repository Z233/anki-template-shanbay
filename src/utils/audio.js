const isDev = process.env.NODE_ENV === 'development'

export async function initAudio() {

  const MIN_DURATION = 1000

  const AudioIconAnimation = function (selector) {
    this.icon = document.querySelector(selector)
    this.volume1 = this.icon.querySelector('.volume-1')
    this.volume2 = this.icon.querySelector('.volume-2')
    this.animations = []
    this.start = -1
    this.duration = 0
  }

  AudioIconAnimation.prototype.setDuration = function (duration) {
    this.duration = duration
  }

  AudioIconAnimation.prototype.play = function () {
    this.start = Date.now()
    this.volume1.style.animation = `play 0.4s steps(4, end) infinite`
    this.volume2.style.animation = `play 0.4s steps(2, end) infinite`
    setTimeout(() => {
      this.stop()
    }, this.duration * 1000)
  }

  AudioIconAnimation.prototype.stop = function () {
    const now = Date.now()
    const end = this.start + MIN_DURATION
    const stopAnimation = () => {
      this.volume1.style.animation = ''
      this.volume2.style.animation = ''
      this.start = -1
    }

    if (now >= end) stopAnimation()
    else {
      setTimeout(() => {
        stopAnimation()
      }, end - now)
    }
  }

  const AudioCommand = function (wrap, animation) {
    this.wrap = wrap
    this.audioElement = null
    this.audioButton = null
    this.animation = animation
  }

  AudioCommand.prototype.init = function () {
    this.audioButton = document.querySelectorAll(
      this.wrap + ' > .replaybutton'
    )[0]
    this.audioElement = document.createElement('audio')

    this.audioElement.preload = 'metadata'
    this.audioElement.src = this.audioButton.href.replace(
      'playsound:',
      ''
    )
  }

  AudioCommand.prototype.play = async function () {
    if (!isDev)
      this.audioButton.dispatchEvent(new MouseEvent('click'))
    if (isDev) this.audioElement.play()
    this.animation.play()
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, this.animation.duration * 1000)
    })
  }

  const pronIconAnimation = new AudioIconAnimation('.pronounceIcon')
  const sentIconAnimation = new AudioIconAnimation('.sentenceIcon')

  const setPlayCommand = function (button, command) {
    button.onclick = function () {
      command.play()
    }
  }

  function getAudioDuration(audioElement) {
    return new Promise((resolve) => {
      audioElement.addEventListener('loadeddata', () => {
        resolve(audioElement.duration)
      })
    })
  }

  // Pronounce Audio
  const playPronounceButton = document.querySelector(
    '#playPronounceButton'
  )
  const pronounceAudio = new AudioCommand(
    '.pronAudioWarp',
    pronIconAnimation
  )
  pronounceAudio.init()
  setPlayCommand(playPronounceButton, pronounceAudio)
  const pronounceAudioDuration = await getAudioDuration(
    pronounceAudio.audioElement
  )
  pronIconAnimation.setDuration(pronounceAudioDuration)

  // Sentence Audio
  const sentenceIcon = document.querySelector('.sentenceIcon')
  const sentenceAudio = new AudioCommand(
    '.sentenceAudioWarp',
    sentIconAnimation
  )
  sentenceAudio.init()
  setPlayCommand(sentenceIcon, sentenceAudio)
  sentIconAnimation.setDuration(
    await getAudioDuration(sentenceAudio.audioElement)
  )

  return pronounceAudio.play()
}
