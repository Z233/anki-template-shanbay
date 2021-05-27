import '../style.css';
import { AudioIconAnimation, AudioCommand } from './utils';
import mockAnkidroid from './mock';
if(void 0===window.Persistence){var _persistenceKey="github.com/SimonLammer/anki-persistence/",_defaultKey="_default";if(window.Persistence_sessionStorage=function(){var e=!1;try{"object"==typeof window.sessionStorage&&(e=!0,this.clear=function(){for(var e=0;e<sessionStorage.length;e++){var t=sessionStorage.key(e);0==t.indexOf(_persistenceKey)&&(sessionStorage.removeItem(t),e--)}},this.setItem=function(e,t){void 0==t&&(t=e,e=_defaultKey),sessionStorage.setItem(_persistenceKey+e,JSON.stringify(t))},this.getItem=function(e){return void 0==e&&(e=_defaultKey),JSON.parse(sessionStorage.getItem(_persistenceKey+e))},this.removeItem=function(e){void 0==e&&(e=_defaultKey),sessionStorage.removeItem(_persistenceKey+e)})}catch(e){}this.isAvailable=function(){return e}},window.Persistence_windowKey=function(e){var t=window[e],i=!1;"object"==typeof t&&(i=!0,this.clear=function(){t[_persistenceKey]={}},this.setItem=function(e,i){void 0==i&&(i=e,e=_defaultKey),t[_persistenceKey][e]=i},this.getItem=function(e){return void 0==e&&(e=_defaultKey),t[_persistenceKey][e]||null},this.removeItem=function(e){void 0==e&&(e=_defaultKey),delete t[_persistenceKey][e]},void 0==t[_persistenceKey]&&this.clear()),this.isAvailable=function(){return i}},window.Persistence=new Persistence_sessionStorage,Persistence.isAvailable()||(window.Persistence=new Persistence_windowKey("py")),!Persistence.isAvailable()){var titleStartIndex=window.location.toString().indexOf("title"),titleContentIndex=window.location.toString().indexOf("main",titleStartIndex);titleStartIndex>0&&titleContentIndex>0&&titleContentIndex-titleStartIndex<10&&(window.Persistence=new Persistence_windowKey("qt"))}}

const isDev = import.meta.env.DEV;
if (isDev) mockAnkidroid();

(async function(AnkiDroidJS) {

  // Init Ankidroid Javascript API
  AnkiDroidJS.init(JSON.stringify({"version" : "0.0.1", "developer" : "dev@mail.com"}));

  const pronIconAnimation = new AudioIconAnimation('.pronounceIcon');
  const sentIconAnimation = new AudioIconAnimation('.sentenceIcon');

  const setPlayCommand = function(button, command) {
    button.onclick = function() {
      command.play();
    }
  }

  function getAudioDuration(audioElement) {
    return new Promise(resolve => {
      audioElement.addEventListener('loadeddata', () => {
        resolve(audioElement.duration);
      });
    });
  };

  // Pronouce Audio
  const playPronounceButton = document.querySelector('#playPronounceButton');
  const pronounceAudio = new AudioCommand('.pronAudioWarp', pronIconAnimation);
  pronounceAudio.init();
  setPlayCommand(playPronounceButton, pronounceAudio);
  pronIconAnimation.setDuration(await getAudioDuration(pronounceAudio.audioElement));
  pronounceAudio.play();

  // Sentence Audio
  const sentenceIcon = document.querySelector('.sentenceIcon');
  const sentenceAudio = new AudioCommand('.sentenAudioWarp', sentIconAnimation);
  sentenceAudio.init();
  setPlayCommand(sentenceIcon, sentenceAudio);
  sentIconAnimation.setDuration(await getAudioDuration(sentenceAudio.audioElement));

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

  showHintButton.onclick = () => {
    toggleElementDisplay(buttonGroup1);
    toggleElementDisplay(buttonGroup2);
    sentenceHint.style.visibility = 'visible';
    sentenceIcon.dispatchEvent(new MouseEvent('click'));
  };

  function toggleElementDisplay(e) {
    const visibility = !e.style.display;
    if (visibility) e.style.display = 'none';
    else if (!visibility) e.style.display = '';
    else console.error('Unknown error.');
  };

  // Count
  const newCardCount  = document.querySelector('#newCardCount');
  const learnCardCount  = document.querySelector('#learnCardCount');
  const ETA = document.querySelector('#ETA');

  newCardCount.innerText = AnkiDroidJS.ankiGetNewCardCount();
  learnCardCount.innerText = AnkiDroidJS.ankiGetRevCardCount();
  ETA.innerText = AnkiDroidJS.ankiGetETA() + 'min';
})(window.AnkiDroidJS)