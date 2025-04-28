import { Module, DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CacheManager } from './app.service.js'
import { RedisModule } from './redis/redis.module.js'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), RedisModule.forRootAsync() as DynamicModule],
  providers: [CacheManager]
})
export class AppModule {}
