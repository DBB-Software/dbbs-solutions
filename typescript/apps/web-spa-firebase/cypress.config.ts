import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: process.env.WEB_SPA_FIREBASE_CYPRESS_BASE_URL,
    supportFile: false
  }
})
