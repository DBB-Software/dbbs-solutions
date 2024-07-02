import { HttpExceptionFilter } from '@dbbs/common'
import { LoggerErrorInterceptor } from '@dbbs/nestjs-module-logger'
import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import helmet from 'helmet'
import { AppModule } from './app.module.js'

/**
 * Initializes the NestJS application with global configurations and middleware.
 *
 * Sets up global filters, CORS, security headers, and global interceptors.
 *
 * @returns {Promise<INestApplication>} The initialized NestJS application instance.
 */
export async function initNestApp(): Promise<INestApplication> {
  const nestApp = await NestFactory.create<NestExpressApplication>(AppModule)

  nestApp.useGlobalFilters(new HttpExceptionFilter())
  nestApp.enableCors()
  nestApp.use(helmet())
  nestApp.disable('x-powered-by')
  nestApp.useGlobalInterceptors(new LoggerErrorInterceptor())

  await nestApp.init()

  return nestApp
}
