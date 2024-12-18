import { redirect } from '@tanstack/react-router'
import { BeforeLoadContext } from '@tanstack/react-router/dist/esm/route'
import { MyRouterContext } from '../routes/__root'

export const beforeLoadAuth = ({
  context,
  location
}: BeforeLoadContext<object, Record<never, string>, MyRouterContext>) => {
  if (!context.auth.jwt) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw redirect({
      to: '/',
      search: {
        redirect: location.href
      }
    })
  }
}
