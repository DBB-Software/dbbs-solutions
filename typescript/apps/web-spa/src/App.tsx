import './index.css'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { ErrorBoundary } from '@dbbs/web-features/src/sentry/react'
import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return (
    <ErrorBoundary fallback={<div>Error here</div>}>
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}

export default App
