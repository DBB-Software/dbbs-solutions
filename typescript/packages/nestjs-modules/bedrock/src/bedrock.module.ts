import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ChatBedrockConverse } from '@langchain/aws'
import { LoggerModule } from '@dbbs/nestjs-module-logger'
import { BedrockService } from './bedrock.service.js'
import { BedrockController } from './bedrock.controller.js'

/**
 * NestJS module for AWS Bedrock integration.
 *
 * Provides AI text generation capabilities through AWS Bedrock language models.
 * This module includes both service and controller components for complete AI integration.
 *
 * @module BedrockModule
 *
 * @example
 * ```typescript
 * import { BedrockModule } from '@dbbs/nestjs-module-bedrock';
 *
 * @Module({
 *   imports: [BedrockModule],
 * })
 * export class AppModule {}
 * ```
 *
 * @see {@link BedrockService} for AI generation methods
 * @see {@link BedrockController} for REST API endpoints
 */
@Module({
  imports: [ConfigModule, LoggerModule.forRoot({})],
  controllers: [BedrockController],
  providers: [
    BedrockService,
    {
      provide: 'BEDROCK_LLM',
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new ChatBedrockConverse({
          model: config.get<string>('AI_MODEL_NAME') || 'us.meta.llama4-maverick-17b-instruct-v1:0',
          temperature: config.get<number>('AI_MODEL_TEMPERATURE') || 0.3,
          maxRetries: config.get<number>('AI_MODEL_MAX_RETRIES') || 4
        })
    }
  ],
  exports: [BedrockService]
})
export class BedrockModule {}
