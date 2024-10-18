import { reactConfig } from '@dbbs/jest-config'
import type { Config } from 'jest'

export default async (): Promise<Config> => ({
  ...reactConfig,
  displayName: 'dbbs-apollo-client',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  setupFilesAfterEnv: ['./__tests__/testUtils/setupTests.ts']
})
