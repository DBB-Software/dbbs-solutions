const config = {
  apiToken: process.env.STRAPI_PAYMENT_API_TOKEN ?? '',
  apiUrl: process.env.STRAPI_PAYMENT_API_BASE_URL ?? '',
  cookieExpirationTime: process.env.STRAPI_PAYMENT_COOKIE_EXPIRATION_TIME ?? 7,
  domain: process.env.STRAPI_PAYMENT_AUTH0_DOMAIN || '',
  clientId: process.env.STRAPI_PAYMENT_AUTH0_CLIENT_ID || '',
  audience: process.env.STRAPI_PAYMENT_AUTH0_AUDIENCE || '',
  backendUrl: process.env.STRAPI_PAYMENT_BACKEND_URL || '',
  scope: 'openid profile email',
  logoutUrl: process.env.STRAPI_PAYMENT_LOGOUT_URL || ''
}

export default config
