import { createRoute } from '@tanstack/react-router'
import PurchasesPage from '../pages/PurchasesPage/PurchasesPage'
import { authenticatedRoute } from './authenticated'

export const purchasesRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: 'purchases',
  component: PurchasesPage
})
