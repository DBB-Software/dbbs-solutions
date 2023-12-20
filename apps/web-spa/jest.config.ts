export default {
  displayName: 'dbbs-web',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: './tsconfig.spec.json' }]
  },
  transformIgnorePatterns: ['node_modules/'],
  setupFilesAfterEnv: ['./src/testUtils/setupTests.ts']
}
