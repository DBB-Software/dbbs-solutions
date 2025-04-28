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
      providers: [],
      exports: [NestRedisModule]
    }
  }
}
