/**
 * TODO: Add logic to conditionally choose the middleware based on the selected authorization method.
 * If Auth0 is selected, use `auth0AuthMiddleware`, otherwise use `extractUserMiddleware`.
 */
import extractUserMiddleware from '../../middlewares/extractUser.middleware'
import checkOrganizationOwnerMiddleware from '../../middlewares/checkOrganizationOwner.middleware'

export default [
  {
    method: 'POST',
    path: '/api/organizations',
    handler: 'organization.create',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware]
    }
  },
  {
    method: 'GET',
    path: '/api/organizations/:id',
    handler: 'organization.getOrganizationById',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkOrganizationOwnerMiddleware]
    }
  },
  {
    method: 'GET',
    path: '/api/organizations',
    handler: 'organization.getUserOrganizations',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware]
    }
  },
  {
    method: 'GET',
    path: '/api/organizations/:id/default-payment-method',
    handler: 'organization.getDefaultPaymentMethod',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkOrganizationOwnerMiddleware]
    }
  },
  {
    method: 'PUT',
    path: '/api/organizations/:id',
    handler: 'organization.update',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkOrganizationOwnerMiddleware]
    }
  },
  {
    method: 'DELETE',
    path: '/api/organizations/:id',
    handler: 'organization.delete',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkOrganizationOwnerMiddleware]
    }
  },
  {
    method: 'PATCH',
    path: '/api/organizations/:id/owner',
    handler: 'organization.updateOwner',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkOrganizationOwnerMiddleware]
    }
  },
  {
    method: 'PATCH',
    path: '/api/organizations/:id/users',
    handler: 'organization.addUser',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkOrganizationOwnerMiddleware]
    }
  },
  {
    method: 'PATCH',
    path: '/api/organizations/:id/remove-user',
    handler: 'organization.removeUser',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkOrganizationOwnerMiddleware]
    }
  },
  {
    method: 'PATCH',
    path: '/api/organizations/:id/invites/:inviteId/accept',
    handler: 'organization.acceptInvite',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware]
    }
  },
  {
    method: 'PATCH',
    path: '/api/organizations/:id/default-payment-method',
    handler: 'organization.createDefaultPaymentMethodUpdateCheckoutSession',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkOrganizationOwnerMiddleware]
    }
  }
]
