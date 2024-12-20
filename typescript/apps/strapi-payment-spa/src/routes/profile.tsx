import { createRoute } from '@tanstack/react-router'
import ProfilePage from '../pages/ProfilePage/ProfilePage'
import { authenticatedRoute } from './authenticated'

export const profileRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: 'profile',
  component: ProfilePage
})
