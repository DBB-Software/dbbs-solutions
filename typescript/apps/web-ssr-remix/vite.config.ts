import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import type { PluginOption } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ['**/*.css']
    }),
    visualizer({
      filename: './build/stats.html',
      gzipSize: true,
      brotliSize: true
    }) as PluginOption,
    tsconfigPaths()
  ]
})
