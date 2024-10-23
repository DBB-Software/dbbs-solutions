import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { APP_GUARD } from '@nestjs/core'
import { JwtStrategy } from './strategies/index.js'
import { RoleGuard } from './guards/index.js'

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), ConfigModule],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: RoleGuard
    }
  ],
  exports: [PassportModule]
})
export class AuthzModule {}
