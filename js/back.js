import './Persistence';
import '../style.css';

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
