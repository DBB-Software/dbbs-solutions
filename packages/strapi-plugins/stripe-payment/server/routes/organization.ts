import extractUserMiddleware from '../middlewares/extractUser.middleware'
import checkOrganizationOwnerMiddleware from '../middlewares/checkOrganizationOwner.middleware'

export default [
  {
    method: 'POST',
    path: '/organizations',
    handler: 'organization.create',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware]
    }
  },
  {
    method: 'GET',
    path: '/organizations/:id',
    handler: 'organization.getOrganizationById',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkOrganizationOwnerMiddleware]
    }
  },
  {
    method: 'GET',
    path: '/organizations',
    handler: 'organization.getOrganizations',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware]
    }
  },
  {
    method: 'PUT',
    path: '/organizations/:id',
    handler: 'organization.update',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkOrganizationOwnerMiddleware]
    }
  },
  {
    method: 'DELETE',
    path: '/organizations/:id',
    handler: 'organization.delete',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkOrganizationOwnerMiddleware]
    }
  },
  {
    method: 'PATCH',
    path: '/organizations/:id/change-owner',
    handler: 'organization.updateOwner',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkOrganizationOwnerMiddleware]
    }
  },
  {
    method: 'PATCH',
    path: '/organizations/:id/add-user',
    handler: 'organization.addUser',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkOrganizationOwnerMiddleware]
    }
  },
  {
    method: 'PATCH',
    path: '/organizations/:id/remove-user/:userId',
    handler: 'organization.removeUser',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware, checkOrganizationOwnerMiddleware]
    }
  },
  {
    method: 'PATCH',
    path: '/organizations/:id/accept-invite',
    handler: 'organization.acceptInvite',
    config: {
      auth: false,
      middlewares: [extractUserMiddleware]
    }
  }
]
