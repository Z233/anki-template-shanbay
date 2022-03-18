const { resolve } = require('path')
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

import fs from 'fs'

function inlineSvelte(templateFile, dest) {
  return {
    name: 'Svelte Inliner',
    generateBundle(opts, bundles) {
      const template = fs.readFileSync(templateFile, 'utf-8')

      Object.keys(bundles).forEach(file => {
        const ext =  file.slice(file.lastIndexOf('.') + 1)
        if (ext === 'js') {
          const name = file.slice(0, file.lastIndexOf('.'))
          const code = template.replace('%%script%%', () => bundles[file].code) 
          fs.writeFileSync(`${opts.dir}/${name}.html`, code)
        }
      })
    },
  }
}

export default {
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
        front: resolve(__dirname + '/src', 'index.js'),
      },
      output: {
        format: 'iife',
        assetFileNames: '[name].[ext]',
        chunkFileNames: '[name].js',
        entryFileNames: '[name].js',
      },
      plugins: [inlineSvelte(resolve('src', 'template.html'))],
    },
    outDir: '../dist',
  },
}
