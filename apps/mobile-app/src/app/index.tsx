import React from 'react'
import { PaperProvider, useDefinedTheme } from '@dbbs/mobile-components'
import { AppNavigator } from '@navigators/app-navigator'

export const App = () => {
  const paperTheme = useDefinedTheme()
  return (
    <PaperProvider theme={paperTheme}>
      <AppNavigator />
    </PaperProvider>
  )
}
