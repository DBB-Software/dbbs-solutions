import React from 'react'
import { AppNavigator } from '@navigators/app-navigator'
import { PaperProvider, useDefinedTheme } from '@dbbs/mobile-components'
import { RemoteConfigProvider } from '@dbbs/mobile-features'
import { initSentry } from '../sentry'

initSentry()

export const App = () => {
  const paperTheme = useDefinedTheme()
  return (
    <PaperProvider theme={paperTheme}>
      <RemoteConfigProvider>
        <AppNavigator />
      </RemoteConfigProvider>
    </PaperProvider>
  )
}
