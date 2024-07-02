/**
 * Defines the default middleware stack for the application.
 * Includes essential middleware for logging, error handling, security, and more.
 * @returns {Array} Array of middleware names to load by default.
 */
export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      patchKoa: true,
      multipart: true,
      includeUnparsed: true
    }
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  'global::settings'
]
