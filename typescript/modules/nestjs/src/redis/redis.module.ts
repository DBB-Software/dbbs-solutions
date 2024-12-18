import { Module, DynamicModule } from '@nestjs/common'
import { RedisModule as NestRedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({})
export class RedisModule {
  static forRootAsync(): DynamicModule {
    return {
      module: RedisModule,
      imports: [
        NestRedisModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) =>
            ({
              type: 'single',
              options: {
                host: configService.get<string>('REDIS_HOST'),
                port: configService.get<number>('REDIS_PORT'),
                username: configService.get<string>('REDIS_USER'),
                password: configService.get<string>('REDIS_PASSWORD')
              }
            }) as RedisModuleOptions
        })
      ],
      // TODO: Provide Cache Service to manage cache if needed
      // providers: [CacheService],
      exports: [
        // CacheService,
        NestRedisModule
      ]
    }
  }
}

// Example of default Redis Service
// import { Injectable } from '@nestjs/common'
// import { InjectRedis } from '@nestjs-modules/ioredis'
// import { Redis } from 'ioredis'
//
// @Injectable()
// export class CacheService {
//   constructor(@InjectRedis() private readonly redisClient: Redis) {}
//
//   method with cache logic
// }
