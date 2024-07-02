import strapi from '@strapi/strapi'

/**
 * Creates a router for the Blog Article API.
 *
 * This router provides the following endpoints:
 *
 * - `GET /blog-articles`: Get a list of blog articles
 * - `GET /blog-articles/:id`: Get a specific blog article by ID
 * - `POST /blog-articles`: Create a new blog article
 * - `PUT /blog-articles/:id`: Update an existing blog article by ID
 * - `DELETE /blog-articles/:id`: Delete a specific blog article by ID
 *
 * @module blog-article-router
 * @returns {Router} The configured router for blog articles
 */
export default strapi.factories.createCoreRouter('api::blog-article.blog-article')
