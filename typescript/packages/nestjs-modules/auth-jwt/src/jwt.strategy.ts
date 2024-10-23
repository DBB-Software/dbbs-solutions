import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'

/**
 * Strategy for JWT authentication.
 * Implements a Passport strategy using JSON Web Tokens.
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
    const secretOrKey = configService.get('JWT_SECRET')

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey,
      ignoreExpiration: false
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
