import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
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
  imports: [ConfigModule],
  controllers: [BedrockController],
  providers: [BedrockService],
  exports: [BedrockService]
})
export class BedrockModule {}
