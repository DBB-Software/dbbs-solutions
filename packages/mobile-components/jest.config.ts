import { baseConfig } from '@dbbs/jest-config'
import { defaults as tsjPreset } from 'ts-jest/presets'

export default {
  ...baseConfig,
  ...tsjPreset,
  preset: 'react-native',
  testMatch: ['**/(__tests__)/**/*.(test|spec|e2e).(ts)'],
  setupFilesAfterEnv: ['./__tests__/testUtils/setupTests.ts']
}
