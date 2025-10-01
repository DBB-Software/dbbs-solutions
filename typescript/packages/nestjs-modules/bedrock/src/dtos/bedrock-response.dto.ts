import { IsString, IsNotEmpty } from 'class-validator'

export class ChatResponseDto {
  /**
   * The generated response from the AI model based on the user's input.
   * This contains the AI's answer or reply to the user's question or prompt.
   * @example "The capital of France is Paris."
   */
  @IsString()
  @IsNotEmpty()
  output: string
}
