import { reactConfig } from '@dbbs/jest-config'
import type { Config } from 'jest'

export default async (): Promise<Config> => ({
  ...reactConfig,
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/src/testUtils/emptyCss.ts'
  }
})
