import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'WEB_APP')

  return {
    plugins: [TanStackRouterVite(), react()],
    envPrefix: 'WEB_APP',
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
