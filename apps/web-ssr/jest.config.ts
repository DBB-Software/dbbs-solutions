import nextJest from 'next/jest'

const createJestConfig = nextJest({ dir: './' })

export default createJestConfig({
  displayName: 'dbbs-web-ssr',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/__tests__/testUtils/setupTests.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '__tests__/testUtils/']
})
