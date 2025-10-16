import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common'
import { InjectLogger, Logger } from '@dbbs/nestjs-module-logger'
import { BedrockService } from './bedrock.service.js'
import { ChatRequestDto } from './dtos/bedrock-request.dto.js'
import { ChatResponseDto } from './dtos/bedrock-response.dto.js'

/**
 * Controller for handling AI chat interactions through AWS Bedrock service.
 * Provides REST endpoints for generating AI responses using language models.
 */
@Controller('ai-chats')
export class BedrockController {
  constructor(
    @InjectLogger(BedrockService.name) private readonly logger: Logger,
    private readonly aiIntegrationService: BedrockService
  ) {}

  /**
   * Generates an AI response based on the provided prompt and user input.
   *
   * @param body - The chat request containing prompt text and user input
   * @returns Promise resolving to the AI-generated response
   * @throws HttpException with INTERNAL_SERVER_ERROR status when AI service fails
   */
  @Post()
  async chat(@Body() body: ChatRequestDto): Promise<ChatResponseDto> {
    try {
      const aiResponse: string = await this.aiIntegrationService.generate(body.promptText, body.input)

      return {
        output: aiResponse
      }
    } catch (error) {
      this.logger.error('Error during AI generation', { error })
      throw new HttpException('AI service unavailable', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
