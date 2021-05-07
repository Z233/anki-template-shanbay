const { resolve } = require('path');
import { defineConfig } from 'vite';
import { viteSingleFile } from "vite-plugin-singlefile";
import { injectHtml } from 'vite-plugin-html';

const NODE_ENV = process.env.NODE_ENV;

export default defineConfig({
  plugins: [
    viteSingleFile(), 
    {
      ...injectHtml({
        injectData: {
          head: NODE_ENV === 'production' ? '' :
          `<meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">`
        }
      })
    }
  ],
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        front: resolve(__dirname, 'front.html'),
        back: resolve(__dirname, 'back.html'),
      },
      inlineDynamicImports: true,
    }
  }
})
