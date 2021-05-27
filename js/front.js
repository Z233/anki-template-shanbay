import '../style.css';
if(void 0===window.Persistence){var _persistenceKey="github.com/SimonLammer/anki-persistence/",_defaultKey="_default";if(window.Persistence_sessionStorage=function(){var e=!1;try{"object"==typeof window.sessionStorage&&(e=!0,this.clear=function(){for(var e=0;e<sessionStorage.length;e++){var t=sessionStorage.key(e);0==t.indexOf(_persistenceKey)&&(sessionStorage.removeItem(t),e--)}},this.setItem=function(e,t){void 0==t&&(t=e,e=_defaultKey),sessionStorage.setItem(_persistenceKey+e,JSON.stringify(t))},this.getItem=function(e){return void 0==e&&(e=_defaultKey),JSON.parse(sessionStorage.getItem(_persistenceKey+e))},this.removeItem=function(e){void 0==e&&(e=_defaultKey),sessionStorage.removeItem(_persistenceKey+e)})}catch(e){}this.isAvailable=function(){return e}},window.Persistence_windowKey=function(e){var t=window[e],i=!1;"object"==typeof t&&(i=!0,this.clear=function(){t[_persistenceKey]={}},this.setItem=function(e,i){void 0==i&&(i=e,e=_defaultKey),t[_persistenceKey][e]=i},this.getItem=function(e){return void 0==e&&(e=_defaultKey),t[_persistenceKey][e]||null},this.removeItem=function(e){void 0==e&&(e=_defaultKey),delete t[_persistenceKey][e]},void 0==t[_persistenceKey]&&this.clear()),this.isAvailable=function(){return i}},window.Persistence=new Persistence_sessionStorage,Persistence.isAvailable()||(window.Persistence=new Persistence_windowKey("py")),!Persistence.isAvailable()){var titleStartIndex=window.location.toString().indexOf("title"),titleContentIndex=window.location.toString().indexOf("main",titleStartIndex);titleStartIndex>0&&titleContentIndex>0&&titleContentIndex-titleStartIndex<10&&(window.Persistence=new Persistence_windowKey("qt"))}}

const isDev = import.meta.env.DEV;

if (isDev) {
  createFakeElement('.pronAudioWarp', 'a', './audio/hello.mp3', 'replaybutton');
  createFakeElement('.sentenAudioWarp', 'a', './audio/sentence.mp3', 'replaybutton');

  function createFakeElement(selector, tag, href, ...classes) {
    const wrap = document.querySelector(selector);
    const ele = document.createElement(tag);
    ele.classList.add(...classes);
    ele.href = href;
    ele.addEventListener('click', function(e) {
      console.log('run there');
      window.event.preventDefault();
    });
    wrap.appendChild(ele);
  }
}

(function(AnkiDroidJS) {

  if (isDev) {
    // Mock Anki API
    AnkiDroidJS = {
      mock: function(propertyName, fn) {
        this[propertyName] = fn;
      }
    };

    AnkiDroidJS.mock('init', () => {});
    AnkiDroidJS.mock('buttonAnswerEase1', () => { console.log(Persistence.getItem()) });
    AnkiDroidJS.mock('buttonAnswerEase2', () => { console.log(Persistence.getItem()) });
    AnkiDroidJS.mock('buttonAnswerEase3', () => { console.log(Persistence.getItem()) });
    AnkiDroidJS.mock('buttonAnswerEase4', () => { console.log(Persistence.getItem()) });
    AnkiDroidJS.mock('ankiGetNewCardCount', () => 20);
    AnkiDroidJS.mock('ankiGetLrnCardCount', () => 100);
    AnkiDroidJS.mock('ankiGetRevCardCount', () => 100);
    AnkiDroidJS.mock('ankiGetETA', () => 29);
    
    // Mock global API
    window.showAnswer = () => window.location = '/back.html';
  }

  // Init Ankidroid Javascript API
  AnkiDroidJS.init(JSON.stringify({"version" : "0.0.1", "developer" : "dev@mail.com"}));

  const audioContext = new AudioContext();

  const AudioCommand = function(wrap) {
    this.wrap = wrap;
    this.audioElement = null;
  }

  AudioCommand.prototype.init = function() {
    const replayButton = document.querySelectorAll(this.wrap + ' > .replaybutton')[0];
    this.audioElement = document.createElement('audio');
    this.audioElement.src = replayButton.href.replace('playsound:', '');

    const track = audioContext.createMediaElementSource(this.audioElement);
    const gainNode = audioContext.createGain();
    track.connect(gainNode).connect(audioContext.destination);
  }

  AudioCommand.prototype.play = function() {
    this.audioElement.play();
  }

  const setPlayCommand = function(button, command) {
    button.onclick = function() {
      command.play();
    }
  }
 
  // Pronouce Audio
  const playPronounceButton = document.querySelector('#playPronounceButton');
  const pronAudioCommand = new AudioCommand('.pronAudioWarp');
  pronAudioCommand.init();
  setPlayCommand(playPronounceButton, pronAudioCommand);

  // Sentence Audio
  const sentenceIcon = document.querySelector('.sentenceIcon');
  const sentAudioCommand = new AudioCommand('.sentenAudioWarp');
  sentAudioCommand.init();
  setPlayCommand(sentenceIcon, sentAudioCommand);

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