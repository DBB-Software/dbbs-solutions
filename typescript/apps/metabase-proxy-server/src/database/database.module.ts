import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema } from './schemas/user.schema.js'
import { OrganizationSchema } from './schemas/organization.schema.js'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DATABASE_URI')
      })
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Organization', schema: OrganizationSchema }
    ])
  ],
  exports: [MongooseModule]
})
export class DatabaseModule {}
