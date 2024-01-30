import React from 'react'
import { TamaguiProvider, config } from '@dbbs/mobile-components'
import { AppNavigator } from '@navigators/app-navigator'

export const App = () => (
  <TamaguiProvider config={config}>
    <AppNavigator />
  </TamaguiProvider>
)
