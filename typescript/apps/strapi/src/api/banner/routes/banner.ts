import strapi from '@strapi/strapi'

/**
 * Creates a router for the Banner API.
 *
 * This router provides the following endpoints:
 *
 * - `GET /banners`: Get a list of banners
 * - `GET /banners/:id`: Get a specific banner by ID
 * - `POST /banners`: Create a new banner
 * - `PUT /banners/:id`: Update an existing banner by ID
 * - `DELETE /banners/:id`: Delete a specific banner by ID
 *
 * @module banner-router
 * @returns {Router} The configured router for banners
 */
export default strapi.factories.createCoreRouter('api::banner.banner')
