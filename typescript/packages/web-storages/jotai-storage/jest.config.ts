import { baseConfig } from '@dbbs/jest-config'
import { JestConfigWithTsJest } from 'ts-jest'
import { defaults as tsjPreset } from 'ts-jest/presets'

const jestConfig: JestConfigWithTsJest = {
  ...baseConfig,
  ...tsjPreset,
  displayName: 'web-jotai-storage'
}

export default jestConfig
