import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
    extensions: ['.js', '.ts']
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: '@import "./src/assets/styles/variables.less";' +
          '@import "./src/assets/styles/common.less";' +
          '@import "./src/assets/styles/mixins.less";'
      }
    }
  },
  build: {
    assetsInlineLimit: 10000
  }
})
