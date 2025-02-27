import { reactConfig } from '@dbbs/jest-config'
import type { Config } from 'jest'

export default async (): Promise<Config> => ({
  ...reactConfig,
  projects: [
    {
      ...reactConfig,
      setupFilesAfterEnv: ['./src/testUtils/setupTests.ts'],
      testMatch: ['**/src/feature/**/*.{test,spec}.[jt]s?(x)'],
      setupFiles: ['./src/testUtils/setup.jest.ts'],
      moduleNameMapper: {
        '\\.(css|scss)$': '<rootDir>/src/testUtils/emptyCss.ts',
        '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/testUtils/emptyImages.ts'
      },
      testEnvironmentOptions: {
        customExportConditions: ['']
      }
    },
    {
      ...reactConfig,
      setupFilesAfterEnv: ['./src/testUtils/setupUnitTests.ts'],
      testMatch: [
        '**/src/data-access/**/*.{test,spec}.[jt]s?(x)',
        '**/src/ui/**/*.{test,spec}.[jt]s?(x)',
        '**/src/utils/**/*.{test,spec}.[jt]s?(x)'
      ],
      setupFiles: ['./src/testUtils/setup.jest.ts'],
      moduleNameMapper: {
        '\\.(css|scss)$': '<rootDir>/src/testUtils/emptyCss.ts',
        '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/testUtils/emptyImages.ts'
      },
      testEnvironmentOptions: {
        customExportConditions: ['']
      }
    }
  ]
})
