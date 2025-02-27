import { Strapi } from '@strapi/strapi'
import jwt from 'jsonwebtoken'

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Strapi }) {
    const auth0Authorization = strapi.config.get('server.auth0.auth0Authorization')

    if (auth0Authorization === 'true') {
      strapi.container.get('auth').register('content-api', {
        name: 'auth0-jwt-verifier',

        async authenticate(ctx) {
          const { authorization } = ctx.request.header

          if (!authorization) {
            return { authenticated: false }
          }

          const parts = authorization.split(/\s+/)
          if (parts[0].toLowerCase() !== 'bearer' || parts.length !== 2) {
            return { authenticated: false }
          }

          const token = parts[1]
          try {
            const publicKey: string = strapi.config.get('server.auth0.signInCertificate')
            const decodedToken = jwt.verify(token, publicKey, {
              algorithms: ['RS256']
            })

            ctx.state.user = decodedToken
            return { authenticated: true, credentials: decodedToken }
          } catch (error) {
            return { authenticated: false }
          }
        }
      })
    }
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap() {}
}
