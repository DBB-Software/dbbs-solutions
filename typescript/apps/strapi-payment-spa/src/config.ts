const config = {
  apiToken: process.env.STRAPI_PAYMENT_API_TOKEN ?? '',
  apiUrl: process.env.STRAPI_PAYMENT_API_BASE_URL ?? '',
  cookieExpirationTime: process.env.STRAPI_PAYMENT_COOKIE_EXPIRATION_TIME ?? 7
}

export default config
