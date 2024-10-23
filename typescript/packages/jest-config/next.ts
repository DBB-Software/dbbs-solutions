import type { Config } from 'jest'
import { baseConfig } from './base.js'

export const nextConfig: Config = {
  ...baseConfig,
  displayName: 'dbbs-web-ssr',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/__tests__/testUtils/setupTests.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '__tests__/testUtils/'],
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/.node/', '/jest/']
}
