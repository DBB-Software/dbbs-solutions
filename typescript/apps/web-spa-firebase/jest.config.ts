import { reactConfig } from '@dbbs/jest-config'
import type { Config } from 'jest'

export default async (): Promise<Config> => ({
  ...reactConfig,
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/src/testUtils/emptyCss.ts',
    '^@dbbs/firebase/app-auth$': '<rootDir>/../../../node_modules/@dbbs/firebase/dist/src/app/auth',
    '^@dbbs/firebase/app$': '<rootDir>/../../../node_modules/@dbbs/firebase/dist/src/app'
  }
})
