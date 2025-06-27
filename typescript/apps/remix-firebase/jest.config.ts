import { baseConfig } from '@dbbs/jest-config'
import type { Config } from 'jest'

export default async (): Promise<Config> => ({
  ...baseConfig,
  setupFilesAfterEnv: ['./__tests__/testUtils/setupTests.ts'],
  testEnvironment: 'jsdom',
  displayName: 'remix-firebase',
  transformIgnorePatterns: ['node_modules/(?!(\\@web3-storage/multipart-parser)/)'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testPathIgnorePatterns: ['<rootDir>/__tests__/testUtils/'],
  moduleNameMapper: {
    '\\.css\\?url$': '<rootDir>/__tests__/testUtils/styleMocks.ts'
  }
})
