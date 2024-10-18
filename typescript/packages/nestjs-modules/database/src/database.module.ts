import { DynamicModule, Global, Module } from '@nestjs/common'
import { KnexModule, KnexModuleOptions } from 'nest-knexjs'

export type IDatabaseOptions = KnexModuleOptions['config']

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(opts: IDatabaseOptions): DynamicModule {
    let { client, connection } = opts

    if (!client) {
      client = process.env.DATABASE_CLIENT
      if (!client) {
        throw new Error('DB client is not defined')
      }
    }
    if (!connection) {
      connection = process.env.DATABASE_URL
      if (!connection) {
        throw new Error('DB url is not defined')
      }
    }

    return {
      module: DatabaseModule,
      imports: [
        KnexModule.forRootAsync({
          useFactory: () => ({
            config: {
              ...opts,
              client,
              connection
            }
          })
        })
      ],
      providers: [DatabaseModule],
      exports: [KnexModule]
    }
  }
}
