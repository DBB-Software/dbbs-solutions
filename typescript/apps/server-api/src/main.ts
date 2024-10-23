import { HttpExceptionFilter } from '@dbbs/common'
import { LoggerErrorInterceptor } from '@dbbs/nestjs-module-logger'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true
  })

  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalInterceptors(new LoggerErrorInterceptor())

  await app.listen(process.env.PORT || 8000)
}
bootstrap()
