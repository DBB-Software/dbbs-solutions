import React from 'react'
import { AppNavigator } from '@navigators/app-navigator'
import { PaperProvider, useDefinedTheme } from '@dbbs/mobile-components'
import { detectAppLanguage, RemoteConfigProvider } from '@dbbs/mobile-features'
import { initSentry } from '../sentry'

import * as resources from './locale'
import '@dbbs/react-localization-provider'

initSentry()

detectAppLanguage(resources)

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
