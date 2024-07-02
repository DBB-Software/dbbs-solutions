import { Strapi } from '@strapi/strapi'
import { errors } from '@strapi/utils'

const extractUserMiddleware = async (ctx, next) => {
  try {
    const user = await strapi.plugins['users-permissions'].services.jwt.getToken(ctx)

    if (!user) {
      throw new errors.UnauthorizedError('User not authenticated')
    }

    ctx.state.user = user
  } catch (err) {
    throw new errors.UnauthorizedError('Invalid token')
  }

  await next()
}

export default extractUserMiddleware
