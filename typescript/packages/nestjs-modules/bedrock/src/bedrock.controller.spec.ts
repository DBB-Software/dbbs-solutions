import { Test, TestingModule } from '@nestjs/testing'
import { HttpException, HttpStatus } from '@nestjs/common'
import { jest } from '@jest/globals'
import { BedrockController } from './bedrock.controller.js'
import { BedrockService } from './bedrock.service.js'
import { ChatRequestDto } from './dtos/bedrock-request.dto.js'
import { LoggerModule } from '@dbbs/nestjs-module-logger'

describe('BedrockController', () => {
  let controller: BedrockController
  let service: BedrockService

  beforeAll(async () => {
    const mockAIService = {
      generate: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot({})],
      controllers: [BedrockController],
      providers: [
        {
          provide: BedrockService,
          useValue: mockAIService
        }
      ]
    }).compile()

    controller = module.get<BedrockController>(BedrockController)
    service = module.get<BedrockService>(BedrockService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('chat', () => {
    it('should return the result from the AI service', async () => {
      const chatRequestDto: ChatRequestDto = {
        promptText: 'Test prompt',
        input: 'Test input'
      }
      jest.spyOn(service, 'generate').mockResolvedValue('Test response from AI')

      const result = await controller.chat(chatRequestDto)

      expect(service.generate).toHaveBeenCalledWith(chatRequestDto.promptText, chatRequestDto.input)
      expect(result).toEqual({ output: 'Test response from AI' })
    })

    it('should throw HttpException when AI service fails', async () => {
      const chatRequestDto: ChatRequestDto = {
        promptText: 'Test prompt',
        input: 'Test input'
      }
      jest.spyOn(service, 'generate').mockRejectedValue(new Error('Service error'))

      await expect(controller.chat(chatRequestDto)).rejects.toThrow(
        new HttpException('AI service unavailable', HttpStatus.INTERNAL_SERVER_ERROR)
      )
    })
  })
})
