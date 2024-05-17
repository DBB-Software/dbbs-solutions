import { baseConfig } from '@dbbs/jest-config'
import { JestConfigWithTsJest } from 'ts-jest'
import { defaults as tsjPreset } from 'ts-jest/presets'

const jestConfig: JestConfigWithTsJest = {
  ...baseConfig,
  ...tsjPreset,
  displayName: 'mobile-components',
  preset: 'react-native',
  transformIgnorePatterns: ['../../node_modules'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  setupFilesAfterEnv: [
    './__tests__/testUtils/setupTests.ts',
    '../../node_modules/react-native-gesture-handler/jestSetup.js'
  ]
}

export default jestConfig
