import { createRoute } from '@tanstack/react-router'
import OrganizationsPage from '../pages/OrganizationsPage/OrganizationsPage'
import OrganizationDetailPage from '../pages/OrganizationDetailPage/OrganizationDetailPage'
import { authenticatedRoute } from './authenticated'

const organizationsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: 'organizations',
  component: OrganizationsPage
})

const organizationDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: 'organizations/$organizationId',
  component: OrganizationDetailPage
})

export { organizationsRoute, organizationDetailRoute }
