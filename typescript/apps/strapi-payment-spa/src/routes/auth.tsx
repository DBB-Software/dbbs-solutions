import { createRoute, redirect } from '@tanstack/react-router'
import RegistrationPage from '../pages/RegistrationPage/RegistrationPage'
import { rootRoute, MyRouterContext } from './__root'

export const registrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: RegistrationPage,
  beforeLoad: async ({ context, search }: { context: MyRouterContext; search: Record<string, never> }) => {
    if (context?.auth?.jwt) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw redirect({ to: '/profile', search })
    }
  }
})
