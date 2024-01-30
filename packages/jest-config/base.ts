import type { Config } from 'jest'

export const baseConfig: Config = {
  displayName: 'dbbs-base',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.spec.json',
        useESM: true
      }
    ]
  },
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  coverageDirectory: './coverage',
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/.node/', '/jest/']
}
