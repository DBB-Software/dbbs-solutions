import { IsString, IsNotEmpty } from 'class-validator'

export class ChatRequestDto {
  /**
   * The prompt text that provides context and instructions for the AI model.
   * This should contain the system message or initial prompt that guides the conversation.
   * @example "You are a helpful assistant. Please answer the following question:"
   */
  @IsString()
  @IsNotEmpty()
  promptText: string

  /**
   * The user input or message that the AI model should respond to.
   * This is the actual question or statement from the user.
   * @example "What is the capital of France?"
   */
  @IsString()
  @IsNotEmpty()
  input: string
}
