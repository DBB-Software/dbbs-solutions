import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const requestHeader = request.headers['x-api-key']
    const apiKey = this.configService.get<string>('METABASE_API_KEY')

    if (requestHeader === apiKey) {
      return true
    }
    throw new ForbiddenException('Access denied: Admins only')
  }
}
