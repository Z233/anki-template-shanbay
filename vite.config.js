const { resolve } = require('path');
const fs = require('fs');
import { injectHtml } from 'vite-plugin-html';
import { defineConfig } from 'vite';
import inline from 'rollup-plugin-inline-js';

const NODE_ENV = process.env.NODE_ENV;

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        front: resolve(__dirname, 'front.html'),
        back: resolve(__dirname, 'back.html'),
        test: resolve(__dirname, 'test.html'),
      }
    },
    watch: {
      include: ['js/**']
    }
  },
  plugins: [
    injectHtml({
      injectData: {
        frontScript: readScript('front.js'),
        backScript: readScript('back.js')
      }
    }),
  ]
})

function readScript(filename) {
  return NODE_ENV === 'production' ? 
  `<script>${fs.readFileSync(resolve(__dirname + '/js/', filename))}</script>` :
  `<script src="js/${filename}"></script>`
}