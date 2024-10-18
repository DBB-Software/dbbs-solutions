import type { Config } from 'jest'

const config: Config = {
  displayName: 'tailwind-components',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: './tsconfig.spec.json' }]
  },
  transformIgnorePatterns: ['node_modules/'],
  setupFilesAfterEnv: ['./src/testUtils/setupTests.ts']
}

export default config
