/**
 * A set of functions called "actions" for `healthcheck`
 */

export default {
  index: async (ctx) => {
    try {
      ctx.body = { status: 'Ok' }
    } catch (err) {
      ctx.body = err
    }
  }
}
