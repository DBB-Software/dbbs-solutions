import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { renderHook, waitFor } from '@testing-library/react-native'
import { RemoteConfigContext, RemoteConfigProvider } from '../../src'

describe('RemoteConfigProvider', () => {
  it('should fetch and set remote config values', async () => {
    const wrapper = ({ children }: { children: ReactNode }) => <RemoteConfigProvider>{children}</RemoteConfigProvider>
    const { result } = renderHook(
      () => {
        const context = useContext(RemoteConfigContext)
        const [configValue, setConfigValue] = useState<string | undefined>()

        useEffect(() => {
          setConfigValue(context?.test?.asString())
        }, [context?.test])

        return configValue
      },
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current).toBe('TEST_REMOTE')
    })
  })
})
