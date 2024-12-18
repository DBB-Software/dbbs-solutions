import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: process.env.STRAPI_PAYMENT_SPA_CYPRESS_BASE_URL,
    supportFile: false
  }
})
