import { isDev } from './helper'
import { loadPersistence } from '../utils/persistence'

export function initAnkiDroid() {
  isDev && mockAnkiDroid()
  loadPersistence()

  // Init Ankidroid Javascript API
  AnkiDroidJS.init(
    JSON.stringify({
      version: '0.0.1',
      developer: 'dev@mail.com',
    })
  )
}

function mockAnkiDroid() {
  // Mock Anki API
  window.AnkiDroidJS = {
    mock: function (propertyName, fn) {
      this[propertyName] = fn
    },
  }

  AnkiDroidJS.mock('init', () => {})
  AnkiDroidJS.mock('buttonAnswerEase1', () => {
    console.log(Persistence.getItem())
    window.location = '/front.html'
  })
  AnkiDroidJS.mock('buttonAnswerEase2', () => {
    console.log(Persistence.getItem())
    window.location = '/front.html'
  })
  AnkiDroidJS.mock('buttonAnswerEase3', () => {
    console.log(Persistence.getItem())
    window.location = '/front.html'
  })
  AnkiDroidJS.mock('buttonAnswerEase4', () => {
    console.log(Persistence.getItem())
    window.location = '/front.html'
  })
  AnkiDroidJS.mock('ankiGetNewCardCount', () => 20)
  AnkiDroidJS.mock('ankiGetLrnCardCount', () => 100)
  AnkiDroidJS.mock('ankiGetRevCardCount', () => 100)
  AnkiDroidJS.mock('ankiGetETA', () => 29)

  // Mock global API
  window.showAnswer = () => (window.location = '/back.html')
}
