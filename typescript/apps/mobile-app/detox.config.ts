import { baseConfig } from '@dbbs/jest-config'
import { type JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  ...baseConfig,
  displayName: 'mobile-app-e2e',
  preset: 'ts-jest',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: './e2e/tsconfig.json',
        useESM: true
      }
    ]
  },
  testMatch: ['<rootDir>/e2e/**/?(*.)+(e2e).[tj]s?(x)'],
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: ['detox/runners/jest/reporter'],
  testEnvironment: 'detox/runners/jest/testEnvironment',
  setupFilesAfterEnv: ['<rootDir>/e2e/testUtils/setupTests.ts'],
  testTimeout: 50000,
  maxWorkers: 1,
  verbose: true
}

export default jestConfig
