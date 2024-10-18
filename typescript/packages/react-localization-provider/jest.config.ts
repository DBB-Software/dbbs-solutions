import { reactConfig } from '@dbbs/jest-config'
import { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  ...reactConfig,
  displayName: 'localization-service',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  setupFilesAfterEnv: ['./__tests__/testUtils/setupTests.ts']
}

export default jestConfig
