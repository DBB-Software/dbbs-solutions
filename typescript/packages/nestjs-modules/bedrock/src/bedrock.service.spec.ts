import { Test, TestingModule } from '@nestjs/testing'
import { BedrockService } from './bedrock.service.js'
import { ConfigService } from '@nestjs/config'
import { jest } from '@jest/globals'
import { ChatBedrockConverse } from '@langchain/aws'
import { AIMessageChunk } from '@langchain/core/messages'

const mockChatBedrockConverse = {
  invoke: jest.fn()
}

jest.mock('@langchain/aws', () => {
  return {
    ChatBedrockConverse: jest.fn().mockImplementation(() => mockChatBedrockConverse)
  }
})

const mockConfigService = {
  get: (key: string) => null
}

describe('BedrockService', () => {
  let service: BedrockService

  beforeEach(async () => {
    process.env.AWS_DEFAULT_REGION = 'mock-aws-region'
    const module: TestingModule = await Test.createTestingModule({
      providers: [BedrockService, { provide: ConfigService, useValue: mockConfigService }]
    }).compile()

    service = module.get(BedrockService)
  })

  describe('constructor', () => {
    it('should create service', () => {
      expect(service).toBeDefined()
    })
  })

  describe('generate', () => {
    it('should send correct messages to AI model and return response', async () => {
      const promptText = 'System prompt'
      const input = 'User input'
      const mockResponse: AIMessageChunk = { text: 'AI response' } as any

      jest.spyOn(ChatBedrockConverse.prototype, 'invoke').mockResolvedValueOnce(mockResponse)

      const result = await service.generate(promptText, input)

      expect(result).toEqual(mockResponse.text)
    })

    it('should throw an error when promptText is empty', async () => {
      const promptText = ''
      const input = 'User input'

      await expect(service.generate(promptText, input)).rejects.toThrow('promptText and input are required')
    })

    it('should throw an error when input is empty', async () => {
      const promptText = 'System prompt'
      const input = ''

      await expect(service.generate(promptText, input)).rejects.toThrow('promptText and input are required')
    })

    it('should throw an error when AI generation fails', async () => {
      const promptText = 'System prompt'
      const input = 'User input'
      const errorMessage = 'AI service error'

      jest.spyOn(ChatBedrockConverse.prototype, 'invoke').mockRejectedValueOnce(new Error(errorMessage))

      await expect(service.generate(promptText, input)).rejects.toThrow(`AI generation failed: ${errorMessage}`)
    })
  })
})
