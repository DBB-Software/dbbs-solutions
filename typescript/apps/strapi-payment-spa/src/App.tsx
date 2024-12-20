import React from 'react'
import { ThemeProvider, theme } from '@dbbs/mui-components'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routes'
import { AuthProvider, useAuth } from './contexts/AuthContext'

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    auth: undefined!
  }
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function ProtectedApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <ProtectedApp />
    </AuthProvider>
  </ThemeProvider>
)

export default App
