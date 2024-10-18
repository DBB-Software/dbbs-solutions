import type { Config } from 'jest'
import { baseConfig } from './base.js'

export const reactConfig: Config = {
  ...baseConfig,
  displayName: 'dbbs-web-spa',
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['node_modules/'],
  setupFilesAfterEnv: ['./src/testUtils/setupTests.ts']
}
