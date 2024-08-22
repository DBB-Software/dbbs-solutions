import { baseConfig } from '@dbbs/jest-config'
import { pathsToModuleNameMapper, type JestConfigWithTsJest } from 'ts-jest'
import { defaults as tsjPreset } from 'ts-jest/presets'
import { compilerOptions } from './tsconfig.json'

const jestConfig: JestConfigWithTsJest = {
  ...baseConfig,
  ...tsjPreset,
  displayName: 'mobile-expo-app',
  preset: 'jest-expo',
  transformIgnorePatterns: [
    '../../node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|react-native-svg)'
  ],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  setupFilesAfterEnv: [
    './__tests__/testUtils/setupTests.ts',
    '../../node_modules/react-native-gesture-handler/jestSetup.js'
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' })
}

export default jestConfig