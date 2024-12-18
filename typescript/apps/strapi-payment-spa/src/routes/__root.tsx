import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { lazy } from 'react'
import { AuthContextType } from '../contexts/AuthContext.tsx'

export interface MyRouterContext {
  auth: AuthContextType
}

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : lazy(() =>
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools
        }))
      )

export const rootRoute = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  )
})
