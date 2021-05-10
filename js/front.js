import '../style.css';
if(void 0===window.Persistence){var _persistenceKey="github.com/SimonLammer/anki-persistence/",_defaultKey="_default";if(window.Persistence_sessionStorage=function(){var e=!1;try{"object"==typeof window.sessionStorage&&(e=!0,this.clear=function(){for(var e=0;e<sessionStorage.length;e++){var t=sessionStorage.key(e);0==t.indexOf(_persistenceKey)&&(sessionStorage.removeItem(t),e--)}},this.setItem=function(e,t){void 0==t&&(t=e,e=_defaultKey),sessionStorage.setItem(_persistenceKey+e,JSON.stringify(t))},this.getItem=function(e){return void 0==e&&(e=_defaultKey),JSON.parse(sessionStorage.getItem(_persistenceKey+e))},this.removeItem=function(e){void 0==e&&(e=_defaultKey),sessionStorage.removeItem(_persistenceKey+e)})}catch(e){}this.isAvailable=function(){return e}},window.Persistence_windowKey=function(e){var t=window[e],i=!1;"object"==typeof t&&(i=!0,this.clear=function(){t[_persistenceKey]={}},this.setItem=function(e,i){void 0==i&&(i=e,e=_defaultKey),t[_persistenceKey][e]=i},this.getItem=function(e){return void 0==e&&(e=_defaultKey),t[_persistenceKey][e]||null},this.removeItem=function(e){void 0==e&&(e=_defaultKey),delete t[_persistenceKey][e]},void 0==t[_persistenceKey]&&this.clear()),this.isAvailable=function(){return i}},window.Persistence=new Persistence_sessionStorage,Persistence.isAvailable()||(window.Persistence=new Persistence_windowKey("py")),!Persistence.isAvailable()){var titleStartIndex=window.location.toString().indexOf("title"),titleContentIndex=window.location.toString().indexOf("main",titleStartIndex);titleStartIndex>0&&titleContentIndex>0&&titleContentIndex-titleStartIndex<10&&(window.Persistence=new Persistence_windowKey("qt"))}}

const isDev = import.meta.env.DEV;

if (isDev) {
  createFakeElement('.pronAudioWarp', 'a', './audio/hello.mp3', 'replaybutton');
  createFakeElement('.sentenAudioWarp', 'a', './audio/hello.mp3', 'replaybutton');

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

  // Button DOM
  const showHintButton = document.querySelector('#showHintButton');
  const buttonGroup1 = document.querySelector('#buttonGroup1');
  const buttonGroup2 = document.querySelector('#buttonGroup2');
  const sentenceHint = document.querySelector('#sentenceHint');
  const answerButtons = document.querySelectorAll('.answerButton');
  // Count DOM
  const newCardCount  = document.querySelector('#newCardCount');
  const learnCardCount  = document.querySelector('#learnCardCount');
  const ETA  = document.querySelector('#ETA');

  // Init Ankidroid Javascript API
  const jsApi = {"version" : "0.0.1", "developer" : "dev@mail.com"};
        AnkiDroidJS.init(JSON.stringify(jsApi));

  newCardCount.innerText = AnkiDroidJS.ankiGetNewCardCount();
  learnCardCount.innerText = AnkiDroidJS.ankiGetRevCardCount();
  ETA.innerText = AnkiDroidJS.ankiGetETA() + 'min';

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

  // Init Pronounce Audio
  const pronReplaybutton = document.querySelectorAll('.pronAudioWarp > .replaybutton')[0];
  const pronounceAudio = document.createElement('audio');

  pronounceAudio.src = pronReplaybutton.href.replace('playsound:', '');

  const PRONOUNCE_ANIMATION_TIME = 1.2;

  if (!isDev) playPronounce();

  function playPronounce() {
    pronReplaybutton.dispatchEvent(new MouseEvent('click'));
    // Animation
    const volume1 = document.querySelectorAll('.pronounceIcon > .volume-1')[0];
    const volume2 = document.querySelectorAll('.pronounceIcon > .volume-2')[0];

    setAudioAnimation(volume1, volume2, PRONOUNCE_ANIMATION_TIME);
  };

  // Init Sentence Audio
  const sentenReplaybutton = document.querySelectorAll('.sentenAudioWarp > .replaybutton')[0];
  const sentenceAudio = document.createElement('audio');
  sentenceAudio.src = sentenReplaybutton.href.replace('playsound:', '');
  const sentenceAudioDuration = sentenceAudio.duration;

  const SENTENCE_ANIMATION_TIME = sentenceAudioDuration / 1000;

  function playSentence() {
    sentenReplaybutton.dispatchEvent(new MouseEvent('click'));
    sentenceAudio.play();
    // Animation
    const volume1 = document.querySelectorAll('.sentenceIcon > .volume-1')[0];
    const volume2 = document.querySelectorAll('.sentenceIcon > .volume-2')[0];

    setAudioAnimation(volume1, volume2, SENTENCE_ANIMATION_TIME);
  }

  function setAudioAnimation(volume1, volume2, duration) {

    volume1.style.animation = `play 0.4s steps(4, end) ${parseInt(duration / 0.4, 10)}`;
    volume2.style.animation = `play 0.4s steps(2, end) ${parseInt(duration / 0.4, 10)}`;

    setTimeout(() => {
      clearAudioAnimation(volume1, volume2);
    }, duration * 1000);
  }

  function clearAudioAnimation(volume1, volume2) {
    volume1.style.animation = '';
    volume2.style.animation = '';
  };

  const playPronounceButton = document.querySelector('#playPronounceButton');
  playPronounceButton.onclick = () => {
    playPronounce();
  };

  const sentenceIcon = document.querySelector('.sentenceIcon');
  sentenceIcon.onclick = () => {
    playSentence();
  };

  showHintButton.onclick = () => {
    toggleElementDisplay(buttonGroup1);
    toggleElementDisplay(buttonGroup2);
    sentenceHint.style.visibility = 'visible';
    playSentence();
  };

  function toggleElementDisplay(e) {
    const visibility = !e.style.display;
    if (visibility) e.style.display = 'none';
    else if (!visibility) e.style.display = '';
    else console.error('Unknown error.');
  };
})(window.AnkiDroidJS)