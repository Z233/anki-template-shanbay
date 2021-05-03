const { resolve } = require('path')

module.exports = {
  build: {
    rollupOptions: {
      input: {
        front: resolve(__dirname, 'card.html')
      }
    }
  }
}