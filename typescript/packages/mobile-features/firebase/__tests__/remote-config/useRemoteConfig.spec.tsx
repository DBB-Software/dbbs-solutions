import { ReactNode } from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { waitFor } from '@testing-library/react-native'
import { RemoteConfigProvider, useRemoteConfig } from '../../src'

type TestRemoteConfig = {
  test: string
}

describe('useRemoteConfig', () => {
  it('should return parsed remote config values', async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <RemoteConfigProvider initialValues={{ test: 'TEST_REMOTE' }}>{children}</RemoteConfigProvider>
    )
    const { result } = renderHook(() => useRemoteConfig<TestRemoteConfig>(), { wrapper })

    await waitFor(() => {
      expect(result?.current?.test).toStrictEqual({ value: 'TEST_REMOTE', source: 'remote' })
    })
  })
})
