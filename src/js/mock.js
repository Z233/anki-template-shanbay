export default function mockAnkidroid() {
  // Mock Anki API
  window.AnkiDroidJS = {
    mock: function(propertyName, fn) {
      this[propertyName] = fn;
    }
  };

  AnkiDroidJS.mock('init', () => {});
  AnkiDroidJS.mock('buttonAnswerEase1', () => { console.log(Persistence.getItem()); window.location = '/front.html'; });
  AnkiDroidJS.mock('buttonAnswerEase2', () => { console.log(Persistence.getItem()); window.location = '/front.html'; });
  AnkiDroidJS.mock('buttonAnswerEase3', () => { console.log(Persistence.getItem()); window.location = '/front.html'; });
  AnkiDroidJS.mock('buttonAnswerEase4', () => { console.log(Persistence.getItem()); window.location = '/front.html'; });
  AnkiDroidJS.mock('ankiGetNewCardCount', () => 20);
  AnkiDroidJS.mock('ankiGetLrnCardCount', () => 100);
  AnkiDroidJS.mock('ankiGetRevCardCount', () => 100);
  AnkiDroidJS.mock('ankiGetETA', () => 29);

  // Mock global API
  window.showAnswer = () => window.location = '/back.html';

  createFakeElement('.pronAudioWarp', 'a', './audio/hello.mp3', 'replaybutton');
  createFakeElement('.sentenceAudioWarp', 'a', './audio/sentence.mp3', 'replaybutton');

  function createFakeElement(selector, tag, href, ...classes) {
    const wrap = document.querySelector(selector);
    const ele = document.createElement(tag);
    ele.classList.add(...classes);
    ele.href = href;
    ele.addEventListener('click', function(e) {
      window.event.preventDefault();
    });
    wrap.appendChild(ele);
  }
}