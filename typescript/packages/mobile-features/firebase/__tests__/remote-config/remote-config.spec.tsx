import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { renderHook, waitFor } from '@testing-library/react-native'
import { RemoteConfigContext, RemoteConfigProvider } from '../../src'

describe('RemoteConfigProvider', () => {
  it('should fetch and set remote config values', async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <RemoteConfigProvider initialValues={{ test: 'TEST_REMOTE' }}>{children}</RemoteConfigProvider>
    )
    const { result } = renderHook(
      () => {
        const { remoteConfigValues } = useContext(RemoteConfigContext)
        const [configValue, setConfigValue] = useState<string | undefined>()

        useEffect(() => {
          setConfigValue(remoteConfigValues?.test?.asString())
        }, [remoteConfigValues?.test])

        return configValue
      },
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current).toBe('TEST_REMOTE')
    })
  })
})
