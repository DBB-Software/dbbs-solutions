import strapi from '@strapi/strapi'

/**
 * Creates a router for the Showcase API.
 *
 * This router provides the following endpoints:
 *
 * - `GET /showcases`: Get a list of showcases
 * - `GET /showcases/:id`: Get a specific showcase by ID
 * - `POST /showcases`: Create a new showcase
 * - `PUT /showcases/:id`: Update an existing showcase by ID
 * - `DELETE /showcases/:id`: Delete a specific showcase by ID
 *
 * @module showcase-router
 * @returns {Router} The configured router for showcases
 */
export default strapi.factories.createCoreRouter('api::showcase.showcase')
