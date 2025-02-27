import createHttpError from 'http-errors'

const extractUserMiddleware = async (ctx, next) => {
  try {
    const user = await strapi.plugins['users-permissions'].services.jwt.getToken(ctx)

    if (!user) {
      throw new createHttpError.Unauthorized('User not authenticated')
    }

    ctx.state.user = user
  } catch (err) {
    throw new createHttpError.Unauthorized('Invalid token')
  }

  await next()
}

export default extractUserMiddleware
