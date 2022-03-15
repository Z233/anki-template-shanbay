import { defineConfig } from 'vite'
import commonConfig from './common.config'
import { merge } from 'lodash'

const { resolve } = require('path')

const config = defineConfig(
  merge(
    {
      build: {
        rollupOptions: {
          input: {
            back: resolve(__dirname + '/src', 'back.js'),
          },
        },
      },
    },
    commonConfig
  )
)

export default config
