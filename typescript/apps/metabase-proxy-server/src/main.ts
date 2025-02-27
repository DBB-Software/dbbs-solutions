import { HttpExceptionFilter } from '@dbbs/common'
import { LoggerErrorInterceptor } from '@dbbs/nestjs-module-logger'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module.js'
import './sentry/instrument.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true
  })
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalInterceptors(new LoggerErrorInterceptor())

  await app.listen(process.env.PORT || 3003)
}
bootstrap()
