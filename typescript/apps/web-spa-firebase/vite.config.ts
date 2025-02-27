import { defineConfig, loadEnv } from 'vite'
import type { PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'WEB_SPA_FIREBASE')

  return {
    plugins: [
      react(),
      visualizer({
        filename: './dist/stats.html',
        gzipSize: true,
        brotliSize: true
      }) as PluginOption
    ],
    envPrefix: 'WEB_SPA_FIREBASE',
    define: {
      ...Object.keys(env).reduce(
        (prev, key) => ({
          ...prev,
          [`process.env.${key}`]: JSON.stringify(env[key])
        }),
        {}
      )
    }
  }
})
