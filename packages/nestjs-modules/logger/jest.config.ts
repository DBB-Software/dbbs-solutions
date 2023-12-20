export default async () => ({
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        useESM: true
      }
    ]
  },
  testMatch: ['**/(__tests__|src)/**/*.(test|spec|e2e-spec).(ts)'],
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
})
