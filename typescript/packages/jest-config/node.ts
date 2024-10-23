import type { Config } from 'jest'
import { baseConfig } from './base.js'

export const nodeConfig: Config = {
  ...baseConfig,
  displayName: 'dbbs-node',
  preset: 'ts-jest',
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['**/(__tests__|src)/**/*.(test|spec|e2e-spec).(ts)'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
}
