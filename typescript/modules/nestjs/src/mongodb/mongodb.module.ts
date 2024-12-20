import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DATABASE_URI')
      })
    })
    // TODO: Implement your schemas
    // MongooseModule.forFeature([
    //   { name: 'User', schema: UserSchema },
    //   { name: 'Account', schema: AccountSchema }
    // ])
  ],
  exports: [MongooseModule]
})
export class MongodbModule {}
