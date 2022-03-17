export const isDev = process.env.NODE_ENV === 'development'

export function getFields() {
  const getInnerHTMLById = (id) => document.getElementById(id).innerHTML
  return {
    word: getInnerHTMLById('word'),
    symbol: getInnerHTMLById('symbol'),
    definition: getInnerHTMLById('definition'),
    sentenceCn: getInnerHTMLById('sentenceCn'),
    sentenceEn: getInnerHTMLById('sentenceEn')
  }
}