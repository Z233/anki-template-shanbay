const { resolve } = require('path')

module.exports = {
  build: {
    rollupOptions: {
      input: {
        front: resolve(__dirname, 'front.html'),
        back: resolve(__dirname, 'back.html')
      }
    }
  }
}