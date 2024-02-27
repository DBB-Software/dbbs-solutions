import { baseConfig } from '@dbbs/jest-config'
import { JestConfigWithTsJest } from 'ts-jest'
import { defaults as tsjPreset } from 'ts-jest/presets'

const jestConfig: JestConfigWithTsJest = {
  ...baseConfig,
  ...tsjPreset,
  preset: 'react-native',
  testMatch: ['**/(__tests__)/**/*.(test|spec|e2e).(ts)'],
  setupFilesAfterEnv: ['./__tests__/testUtils/setupTests.ts']
}

export default jestConfig
