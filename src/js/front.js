import '../style.css';
import mockAnkidroid from './mock';
if(void 0===window.Persistence){var _persistenceKey="github.com/SimonLammer/anki-persistence/",_defaultKey="_default";if(window.Persistence_sessionStorage=function(){var e=!1;try{"object"==typeof window.sessionStorage&&(e=!0,this.clear=function(){for(var e=0;e<sessionStorage.length;e++){var t=sessionStorage.key(e);0==t.indexOf(_persistenceKey)&&(sessionStorage.removeItem(t),e--)}},this.setItem=function(e,t){void 0==t&&(t=e,e=_defaultKey),sessionStorage.setItem(_persistenceKey+e,JSON.stringify(t))},this.getItem=function(e){return void 0==e&&(e=_defaultKey),JSON.parse(sessionStorage.getItem(_persistenceKey+e))},this.removeItem=function(e){void 0==e&&(e=_defaultKey),sessionStorage.removeItem(_persistenceKey+e)})}catch(e){}this.isAvailable=function(){return e}},window.Persistence_windowKey=function(e){var t=window[e],i=!1;"object"==typeof t&&(i=!0,this.clear=function(){t[_persistenceKey]={}},this.setItem=function(e,i){void 0==i&&(i=e,e=_defaultKey),t[_persistenceKey][e]=i},this.getItem=function(e){return void 0==e&&(e=_defaultKey),t[_persistenceKey][e]||null},this.removeItem=function(e){void 0==e&&(e=_defaultKey),delete t[_persistenceKey][e]},void 0==t[_persistenceKey]&&this.clear()),this.isAvailable=function(){return i}},window.Persistence=new Persistence_sessionStorage,Persistence.isAvailable()||(window.Persistence=new Persistence_windowKey("py")),!Persistence.isAvailable()){var titleStartIndex=window.location.toString().indexOf("title"),titleContentIndex=window.location.toString().indexOf("main",titleStartIndex);titleStartIndex>0&&titleContentIndex>0&&titleContentIndex-titleStartIndex<10&&(window.Persistence=new Persistence_windowKey("qt"))}}

const isDev = import.meta.env.DEV;

if (isDev) mockAnkidroid();

(function (AnkiDroidJS) {

  // Init Ankidroid Javascript API
  AnkiDroidJS.init(JSON.stringify({
    "version": "0.0.1",
    "developer": "dev@mail.com"
  }));

  async function initAudio() {
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
    const pronounceAudioDuration = await getAudioDuration(pronounceAudio.audioElement)
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
  initAudio();
  


  const timer = document.querySelector('#timer');
  const DURATION = 10000;
  let start;

  function step(timestamp) {
    if (start === undefined) start = timestamp;
    const elapsed = timestamp - start;
    timer.style.width = Math.min(100 / DURATION * elapsed, 100) + '%';
    if (elapsed < DURATION) window.requestAnimationFrame(step);
  }

  window.requestAnimationFrame(step);

  // Answer Button
  const answerButtons = document.querySelectorAll('.answerButton');

  for (const button in answerButtons) {
    if (Object.hasOwnProperty.call(answerButtons, button)) {
      const element = answerButtons[button];
      element.addEventListener('click', () => {
        if (Persistence.isAvailable()) {
          Persistence.setItem(element.dataset.status);
          showAnswer();
        } else {
          window.alert(`Persistence is not available.`);
        }
      });
    }
  }

  // Show Hint Button
  const showHintButton = document.querySelector('#showHintButton');
  const buttonGroup1 = document.querySelector('#buttonGroup1');
  const buttonGroup2 = document.querySelector('#buttonGroup2');
  const sentenceHint = document.querySelector('#sentenceHint');
  const sentenceIcon = document.querySelector('.sentenceIcon');


  const sentenceEnWrap = document.querySelector('#sentence-en')
  const hasSentenceHint = sentenceEnWrap.innerHTML.trim() !== '';
  const word = document.querySelector('#word').innerText;
  const sentenceEn = sentenceEnWrap.innerHTML;
  const re = new RegExp(word, 'gi');
  sentenceEnWrap.innerHTML = sentenceEn.replace(re, `<span class="highlight">${word}</span>`)

  if (hasSentenceHint) {
    showHintButton.onclick = (e) => {
      toggleElementDisplay(buttonGroup1);
      toggleElementDisplay(buttonGroup2);
      sentenceHint.style.visibility = 'visible';
      sentenceIcon.dispatchEvent(new MouseEvent('click'));
    };
  } else {
    showHintButton.innerText = '不认识';
    showHintButton.onclick = () => {
      Persistence.setItem(1);
      showAnswer();
    }
  }

  function toggleElementDisplay(e) {
    const visibility = !e.style.display;
    if (visibility) e.style.display = 'none';
    else if (!visibility) e.style.display = '';
    else console.error('Unknown error.');
  };

  // Count
  const newCardCount = document.querySelector('#newCardCount');
  const learnCardCount = document.querySelector('#learnCardCount');
  const ETA = document.querySelector('#ETA');

  newCardCount.innerText = AnkiDroidJS.ankiGetNewCardCount();
  learnCardCount.innerText = parseInt(AnkiDroidJS.ankiGetLrnCardCount(), 10) + parseInt(AnkiDroidJS.ankiGetRevCardCount(), 10);
  ETA.innerText = AnkiDroidJS.ankiGetETA() + 'min';
})(window.AnkiDroidJS)