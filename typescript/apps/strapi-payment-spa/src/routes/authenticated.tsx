import { createRoute, Outlet } from '@tanstack/react-router'
import { beforeLoadAuth } from '../utils/auth'
import { rootRoute } from './__root'
import { Menu } from '../components/navigation'

export const authenticatedRoute = createRoute({
  id: 'layout',
  getParentRoute: () => rootRoute,
  beforeLoad: beforeLoadAuth,
  component: () => (
    <>
      <Menu />
      <Outlet />
    </>
  )
})
