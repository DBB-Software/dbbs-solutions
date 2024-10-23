export default [
  {
    method: 'POST',
    path: '/admin/organizations',
    handler: 'organization.createByAdmin',
    config: {}
  },
  {
    method: 'GET',
    path: '/admin/organizations/:id',
    handler: 'organization.getOrganizationById',
    config: {}
  },
  {
    method: 'GET',
    path: '/admin/organizations',
    handler: 'organization.getAllOrganizations',
    config: {}
  },
  {
    method: 'PUT',
    path: '/admin/organizations/:id',
    handler: 'organization.update',
    config: {}
  },
  {
    method: 'DELETE',
    path: '/admin/organizations/:id',
    handler: 'organization.delete',
    config: {}
  },
  {
    method: 'PATCH',
    path: '/admin/organizations/:id/change-owner',
    handler: 'organization.updateOwner',
    config: {}
  },
  {
    method: 'PATCH',
    path: '/admin/organizations/:id/add-user',
    handler: 'organization.addUser',
    config: {}
  },
  {
    method: 'PATCH',
    path: '/admin/organizations/:id/remove-user/:userId',
    handler: 'organization.removeUser',
    config: {}
  }
]
