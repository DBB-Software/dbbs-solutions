/**
 * Default REST API configuration for handling requests.
 * Sets limits and configurations for API responses.
 * @returns {Object} The default settings for the REST API.
 */
export default {
  rest: {
    defaultLimit: 25,
    maxLimit: 100,
    withCount: true
  }
}
