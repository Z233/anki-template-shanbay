import '../style.css';
if(void 0===window.Persistence){var _persistenceKey="github.com/SimonLammer/anki-persistence/",_defaultKey="_default";if(window.Persistence_sessionStorage=function(){var e=!1;try{"object"==typeof window.sessionStorage&&(e=!0,this.clear=function(){for(var e=0;e<sessionStorage.length;e++){var t=sessionStorage.key(e);0==t.indexOf(_persistenceKey)&&(sessionStorage.removeItem(t),e--)}},this.setItem=function(e,t){void 0==t&&(t=e,e=_defaultKey),sessionStorage.setItem(_persistenceKey+e,JSON.stringify(t))},this.getItem=function(e){return void 0==e&&(e=_defaultKey),JSON.parse(sessionStorage.getItem(_persistenceKey+e))},this.removeItem=function(e){void 0==e&&(e=_defaultKey),sessionStorage.removeItem(_persistenceKey+e)})}catch(e){}this.isAvailable=function(){return e}},window.Persistence_windowKey=function(e){var t=window[e],i=!1;"object"==typeof t&&(i=!0,this.clear=function(){t[_persistenceKey]={}},this.setItem=function(e,i){void 0==i&&(i=e,e=_defaultKey),t[_persistenceKey][e]=i},this.getItem=function(e){return void 0==e&&(e=_defaultKey),t[_persistenceKey][e]||null},this.removeItem=function(e){void 0==e&&(e=_defaultKey),delete t[_persistenceKey][e]},void 0==t[_persistenceKey]&&this.clear()),this.isAvailable=function(){return i}},window.Persistence=new Persistence_sessionStorage,Persistence.isAvailable()||(window.Persistence=new Persistence_windowKey("py")),!Persistence.isAvailable()){var titleStartIndex=window.location.toString().indexOf("title"),titleContentIndex=window.location.toString().indexOf("main",titleStartIndex);titleStartIndex>0&&titleContentIndex>0&&titleContentIndex-titleStartIndex<10&&(window.Persistence=new Persistence_windowKey("qt"))}}

const UA = navigator.userAgent;
const isMobile = /Android/i.test(UA);
const isAndroidWebview = /wv/i.test(UA);

// Mock Anki API
if (!isMobile) {
  AnkiDroidJS = {
    init: function() {},
    ankiGetNewCardCount: () => 20,
    ankiGetLrnCardCount: () => 100,
    ankiGetETA: () => '29'
  };
  function buttonAnswerEase1() { console.log(Persistence.getItem()); window.location = '/front.html'; };
  function buttonAnswerEase2() { console.log(Persistence.getItem()); window.location = '/front.html'; };
  function buttonAnswerEase3() { console.log(Persistence.getItem()); window.location = '/front.html'; };
  function buttonAnswerEase4() { console.log(Persistence.getItem()); window.location = '/front.html'; };
  function showAnswer() { window.location = '/back.html' };
}

const status = parseInt(Persistence.getItem(), 10);
const nextButton = document.querySelector('#nextButton');
nextButton.onclick = () => {
  switch (status) {
    case 4:
      buttonAnswerEase4();
      break;

    case 3:
      buttonAnswerEase3();
      break;

    case 2:
      buttonAnswerEase2();
      break;

    case 1:
      buttonAnswerEase1();
      break;

    default:
      break;
  }
};

// Init Pronounce Audio
const pronReplaybutton = document.querySelectorAll('.pronAudioWarp > .replaybutton')[0];
const pronounceAudio = document.createElement('audio');

if (isMobile) pronounceAudio.src = pronReplaybutton.href.replace('playsound:', '');

const PRONOUNCE_ANIMATION_TIME = 1.2;
let audioTimeout = -1;

playPronounce();

function playPronounce() {
  document.querySelector('.pronAudioWarp').children[0].dispatchEvent(new MouseEvent('click'));
  // Animation
  const volume1 = document.querySelectorAll('.pronounceIcon > .volume-1')[0];
  const volume2 = document.querySelectorAll('.pronounceIcon > .volume-2')[0];

  setAudioAnimation(volume1, volume2, PRONOUNCE_ANIMATION_TIME);
};

// Init Sentence Audio
const sentenReplaybutton = document.querySelectorAll('.sentenAudioWarp > .replaybutton')[0];
const sentenceAudio = document.createElement('audio');
if (isMobile) sentenceAudio.src = sentenReplaybutton.href.replace('playsound:', '');
const sentenceAudioDuration = sentenceAudio.duration;

const SENTENCE_ANIMATION_TIME = sentenceAudioDuration / 1000;

function playSentence() {
  document.querySelector('.sentenAudioWarp').children[0].dispatchEvent(new MouseEvent('click'));
  // sentenceAudio.play();
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
