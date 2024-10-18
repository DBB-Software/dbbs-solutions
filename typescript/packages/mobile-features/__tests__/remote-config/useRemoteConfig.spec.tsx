import { ReactNode } from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { waitFor } from '@testing-library/react-native'
import { RemoteConfigProvider, useRemoteConfig } from '../../src'

describe('useRemoteConfig', () => {
  it('should return parsed remote config values', async () => {
    const wrapper = ({ children }: { children: ReactNode }) => <RemoteConfigProvider>{children}</RemoteConfigProvider>
    const { result } = renderHook(() => useRemoteConfig(), { wrapper })

    await waitFor(() => {
      expect(result?.current?.test).toStrictEqual({ value: 'TEST_REMOTE', source: 'remote' })
    })
  })
})
