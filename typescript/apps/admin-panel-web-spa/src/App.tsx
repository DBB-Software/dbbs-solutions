import './index.css'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { ErrorBoundary } from '@dbbs/web-features/src/sentry/react'
import { ThemeProvider } from '@dbbs/mui-components'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { routeTree } from './routeTree.gen'
import theme from './theme'
import { store } from './store'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return (
    <>
      <ErrorBoundary fallback={<div>Error here</div>}>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
          </ThemeProvider>
        </Provider>
      </ErrorBoundary>
      <ToastContainer />
    </>
  )
}

export default App
