import { createRoute } from '@tanstack/react-router'
import SubscriptionsPage from '../pages/SubscriptionsPage/SubscriptionsPage'
import { authenticatedRoute } from './authenticated'

export const subscriptionsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: 'subscriptions',
  component: SubscriptionsPage
})
