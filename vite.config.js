const { resolve } = require('path');
import { defineConfig } from 'vite';
import { viteSingleFile } from "vite-plugin-singlefile";
import { injectHtml, minifyHtml } from 'vite-plugin-html';

const NODE_ENV = process.env.NODE_ENV;

export default defineConfig({
  root: 'src',
  plugins: [
    viteSingleFile(), 
    minifyHtml(),
    injectHtml({
      injectData: {
        head: NODE_ENV === 'production' ? '' :
        `<meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">`
      }
    })
  ],
  build: {
    target: "esnext",
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    brotliSize: false,
    rollupOptions: {
      input: {
        front: resolve(__dirname + '/src', 'front.html'),
        back: resolve(__dirname + '/src', 'back.html'),
      },
      inlineDynamicImports: true,
    },
    outDir: '../dist',
    emptyOutDir: true
  }
})
