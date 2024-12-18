import { rootRoute } from './__root'
import { registrationRoute } from './auth'
import { profileRoute } from './profile'
import { subscriptionsRoute } from './subscriptions'
import { purchasesRoute } from './purchases'
import { organizationsRoute, organizationDetailRoute } from './organization'
import { authenticatedRoute } from './authenticated'

export const routeTree = rootRoute.addChildren([
  registrationRoute,
  authenticatedRoute.addChildren([
    profileRoute,
    subscriptionsRoute,
    purchasesRoute,
    organizationsRoute,
    organizationDetailRoute
  ])
])
