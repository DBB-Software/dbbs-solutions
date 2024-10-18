import { reactConfig } from '@dbbs/jest-config'
import type { Config } from 'jest'

export default async (): Promise<Config> => ({
  displayName: 'dbbs-web-features',
  ...reactConfig
})
