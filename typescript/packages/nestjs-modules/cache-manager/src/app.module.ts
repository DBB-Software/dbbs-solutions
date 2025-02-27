import { Module, DynamicModule } from '@nestjs/common'
import { RedisModule } from '@dbbs/nestjs-modules'
import { ConfigModule } from '@nestjs/config'
import { CacheManager } from './app.service.js'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), RedisModule.forRootAsync() as DynamicModule],
  providers: [CacheManager]
})
export class AppModule {}
