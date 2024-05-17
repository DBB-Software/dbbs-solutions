import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { passportJwtSecret } from 'jwks-rsa'
import { ConfigService } from '@nestjs/config'

/**
 * Strategy for JWT authentication.
 * Implements a Passport strategy using JSON Web Tokens, fetching JWT signing keys from a JWKS endpoint.
 * @class JwtStrategy
 * @extends {PassportStrategy(Strategy)}
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Creates an instance of JwtStrategy.
   * @constructor
   * @param {ConfigService} configService - The configuration service for accessing environment variables.
   */
  constructor(private configService: ConfigService) {
    const audience = configService.get('AUTH0_AUDIENCE')
    const issuer = configService.get('AUTH0_ISSUER_URL')

    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${issuer}.well-known/jwks.json`
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience,
      issuer,
      algorithms: ['RS256']
    })
  }

  /**
   * Validates the JWT payload.
   * @param {unknown} payload - The JWT payload extracted from the token.
   * @returns {unknown} The validated and possibly transformed payload.
   */
  validate(payload: unknown): unknown {
    return payload
  }
}
