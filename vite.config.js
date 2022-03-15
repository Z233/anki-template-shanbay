const { resolve } = require('path')
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
// import legacy from '@vitejs/plugin-legacy'

import fs from 'fs'
import path from 'path'

const NODE_ENV = process.env.NODE_ENV

function inlineSvelte(templateFile, dest) {
  return {
    name: 'Svelte Inliner',
    generateBundle(opts, bundles) {
      const template = fs.readFileSync(templateFile, 'utf-8')

      Object.keys(bundles).forEach(file => {
        const name = file.slice(0, file.lastIndexOf('.'))
        const code = template.replace('%%script%%', () => bundles[file].code) 
        fs.writeFileSync(`${opts.dir}/${name}.html`, code)
      })
    },
  }
}

export default defineConfig({
  root: 'src',
  base: '/',
  publicDir: 'public',
  plugins: [
    svelte(),
    viteCommonjs(),
  ],
  build: {
    minify: 'terser',
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        front: resolve(__dirname + '/src', 'front.js'),
      },
      inlineDynamicImports: true,
      output: {
        format: 'iife',
        assetFileNames: '[name].[ext]',
        chunkFileNames: '[name].html',
        entryFileNames: '[name].js',
      },
      plugins: [inlineSvelte(`./src/template.html`)],
    },
    outDir: '../dist',
    emptyOutDir: true,
  },
})
