export const defaultOrganization = {
  id: 1,
  name: 'Test Organization',
  customer_id: 'cus_123',
  owner_id: 1,
  users: [],
  invites: [],
  quantity: 10,
  subscription: {
    stripe_id: 'sub_123'
  }
}

export const updatedOrganization = {
  id: 1,
  name: 'Updated Organization',
  customer_id: 'cus_123',
  owner_id: 2,
  users: [2],
  quantity: 10
}
