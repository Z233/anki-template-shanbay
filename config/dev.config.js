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
            front: resolve(__dirname + '/src', 'front.js'),
          },
        },
      },
      server: {
        watch: {
          usePolling: true,
        }
      }
    },
    commonConfig
  )
)

export default config
