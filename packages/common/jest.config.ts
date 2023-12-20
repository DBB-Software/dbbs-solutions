import type { Config } from 'jest'

export default async (): Promise<Config> => ({
  roots: ['<rootDir>/__tests__/'],
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['**/(__tests__|src)/**/*.(test|spec|e2e-spec).(ts)'],
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default-esm',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.spec.json',
        useESM: true
      }
    ]
  },
  moduleNameMapper: {
    '(.+)\\.js': '$1'
  }
})
