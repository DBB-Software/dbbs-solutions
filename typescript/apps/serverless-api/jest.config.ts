import { nodeConfig } from '@dbbs/jest-config'
import type { Config } from 'jest'

export default async (): Promise<Config> => ({
  ...nodeConfig
})
