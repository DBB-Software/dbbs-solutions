import jwt from 'jsonwebtoken'
import createHttpError from 'http-errors'

const auth0AuthMiddleware = async (ctx, next) => {
  const authHeader = ctx.request.header.authorization

  if (!authHeader) {
    throw new createHttpError.Unauthorized('No authorization header found')
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    throw new createHttpError.Unauthorized('No token found in authorization header')
  }

  try {
    const publicKey: string = strapi.config.get('server.auth0.publicKey')

    const decodedToken = jwt.verify(token, publicKey, {
      algorithms: ['RS256']
    })

    ctx.state.user = decodedToken
    await next()
  } catch (error) {
    console.error('Token verification failed:', error.message)
    throw new createHttpError.Unauthorized('Invalid token')
  }
}

export default auth0AuthMiddleware
