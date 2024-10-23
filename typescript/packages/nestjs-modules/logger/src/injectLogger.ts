import { Inject, Provider } from '@nestjs/common'
import { Logger } from './logger.js'

const decoratedTokenPrefix = 'NestLogger:'

const decoratedLoggers = new Set<string>()

function getLoggerToken(context: string): string {
  return `${decoratedTokenPrefix}${context}`
}

export function InjectLogger(context = '') {
  decoratedLoggers.add(context)
  return Inject(getLoggerToken(context))
}

function createDecoratedLoggerProvider(context: string): Provider<Logger> {
  return {
    provide: getLoggerToken(context),
    useFactory: (logger: Logger) => {
      logger.setContext(context)
      return logger
    },
    inject: [Logger]
  }
}

export function createProvidersForDecorated(): Array<Provider<Logger>> {
  return [...decoratedLoggers.values()].map(createDecoratedLoggerProvider)
}
