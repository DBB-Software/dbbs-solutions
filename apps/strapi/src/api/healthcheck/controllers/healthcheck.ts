/**
 * Controller actions for managing health check endpoints.
 * This set of actions provides API endpoints for checking the system's health status.
 */

export default {
  /**
   * Checks the health of the service and responds with the current status.
   * @param {Object} ctx - The context object containing request and response objects.
   * @returns {void} Sets the response object's body directly to indicate service status.
   */
  index: async (ctx) => {
    try {
      ctx.body = { status: 'Ok' }
    } catch (err) {
      ctx.body = err
    }
  }
}
