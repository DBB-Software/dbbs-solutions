export const defaultOrganization = {
  id: 1,
  name: 'Test Organization',
  customer_id: 'cus_123',
  owner_id: 1,
  payment_method_id: 1,
  users: [],
  invites: [],
  quantity: 10,
  subscription: {
    stripe_id: 'sub_123'
  }
}

export const stripePaymentMethod = {
  card: {
    brand: 'visa',
    exp_month: 1,
    exp_year: 1,
    last4: '4242'
  }
}

export const defaultPaymentMethod = {
  brand: 'visa',
  expMonth: 1,
  expYear: 1,
  last4: '4242'
}

export const defaultCheckoutSession = {
  id: 1,
  customer: 'cus_123',
  url: 'https://checkout.stripe.com'
}

export const updatedOrganization = {
  id: 1,
  name: 'Updated Organization',
  customer_id: 'cus_123',
  owner_id: 2,
  users: [2],
  quantity: 10
}

export const successUrl = 'http://localhost:3000'
export const currency = 'usd'
