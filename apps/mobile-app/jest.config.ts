import { baseConfig } from '@dbbs/jest-config'
import { pathsToModuleNameMapper, type JestConfigWithTsJest } from 'ts-jest'
import { defaults as tsjPreset } from 'ts-jest/presets'
import { compilerOptions } from './tsconfig.json'

const jestConfig: JestConfigWithTsJest = {
  ...baseConfig,
  ...tsjPreset,
  preset: 'react-native',
  transformIgnorePatterns: ['node_modules/(tamagui|@tamagui|@tamagui/animations-moti)'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  setupFilesAfterEnv: [
    '../../node_modules/react-native-gesture-handler/jestSetup.js',
    './__tests__/testUtils/setupTests.ts'
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' })
}

export default jestConfig
