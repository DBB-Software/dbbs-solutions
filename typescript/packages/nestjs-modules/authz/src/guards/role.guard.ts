import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { ROLES_KEY } from '../decorators/index.js'
import { JwtStrategy } from '../strategies/index.js'
import { Auth0Roles } from '../enums/index.js'
import { User } from '../types/index.js'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtStrategy: JwtStrategy
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (!requiredRoles) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()
    const authHeader = request.headers.authorization

    if (!authHeader && requiredRoles.includes(Auth0Roles.PUBLIC)) {
      return true
    }

    if (!authHeader) {
      return false
    }

    try {
      const token = authHeader.split(' ')[1]
      const user = (await this.jwtStrategy.validate({ token })) as User

      return requiredRoles.some((role) => user.roles.includes(role))
    } catch (error) {
      return false
    }
  }
}
