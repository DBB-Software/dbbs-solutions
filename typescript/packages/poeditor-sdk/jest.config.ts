import { baseConfig } from '@dbbs/jest-config';
import type { Config } from 'jest';

export default async (): Promise<Config> => ({
  ...baseConfig,
  setupFilesAfterEnv: ["<rootDir>/src/testUtils/setupTests.ts"],
});
