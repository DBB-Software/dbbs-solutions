import { baseConfig } from '@dbbs/jest-config'
import { pathsToModuleNameMapper, type JestConfigWithTsJest } from 'ts-jest'
import { defaults as tsjPreset } from 'ts-jest/presets'
import { compilerOptions } from './tsconfig.json'

const jestConfig: JestConfigWithTsJest = {
  ...baseConfig,
  ...tsjPreset,
  displayName: 'mobile-app',
  preset: 'react-native',
  transformIgnorePatterns: ['../../../node_modules', '../packages'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  setupFilesAfterEnv: [
    './__tests__/testUtils/setupTests.ts',
    '../../../node_modules/react-native-gesture-handler/jestSetup.js'
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' })
}

export default jestConfig
