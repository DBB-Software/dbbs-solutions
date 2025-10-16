import { Inject, Injectable } from '@nestjs/common'
import { ChatBedrockConverse } from '@langchain/aws'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

/**
 * Service for integrating with AWS Bedrock language models through LangChain.
 * Provides AI text generation capabilities using configurable Bedrock models.
 *
 * @example
 * ```typescript
 * const response = await bedrockService.generate(
 *   "You are a helpful assistant",
 *   "What is the weather like today?"
 * );
 * ```
 */
@Injectable()
export class BedrockService {
  /**
   * Initializes the Bedrock service with configuration from environment variables.
   *
   * @param configService - NestJS configuration service for accessing environment variables
   */
  constructor(@Inject('BEDROCK_LLM') private readonly llm: ChatBedrockConverse) {}

  /**
   * Generates an AI response using AWS Bedrock language model.
   *
   * @param promptText - System message that provides context or instructions to the AI model
   * @param input - User's input message or question to be processed by the AI
   * @returns Promise that resolves to the AI-generated text response
   * @throws Error when promptText or input are missing, or when AI generation fails
   *
   * @example
   * ```typescript
   * const response = await bedrockService.generate(
   *   "You are a helpful coding assistant",
   *   "Explain what TypeScript is"
   * );
   * console.log(response); // AI-generated explanation of TypeScript
   * ```
   */
  async generate(promptText: string, input: string): Promise<string> {
    // Additional validation to ensure the service is robust and can handle non-HTTP use cases
    if (!promptText || !input) {
      throw new Error('promptText and input are required')
    }

    const messages = [new SystemMessage({ content: promptText }), new HumanMessage({ content: input })]
    try {
      const response = await this.llm.invoke(messages)
      return response.text
    } catch (error) {
      throw new Error(`AI generation failed: ${error instanceof Error ? error.message : error?.toString()}`)
    }
  }
}
