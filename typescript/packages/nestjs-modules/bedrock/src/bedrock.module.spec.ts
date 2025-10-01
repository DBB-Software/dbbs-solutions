import { Test } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { jest } from '@jest/globals'
import { BedrockModule } from './bedrock.module.js'
import { BedrockService } from './bedrock.service.js'

describe('BedrockModule', () => {
  const mockConfigService = {
    get: jest.fn((key: string) => null)
  }

  beforeEach(() => {
    process.env.AWS_DEFAULT_REGION = 'mock-aws-region'
    jest.clearAllMocks()
  })

  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [BedrockModule]
    })
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .compile()

    expect(module).toBeDefined()
  })

  it('should provide BedrockService', async () => {
    const module = await Test.createTestingModule({
      imports: [BedrockModule]
    })
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .compile()

    const service = module.get<BedrockService>(BedrockService)
    expect(service).toBeDefined()
  })

  it('should import ConfigModule', async () => {
    const createTestingModuleSpy = jest.spyOn(Test, 'createTestingModule')

    await Test.createTestingModule({
      imports: [BedrockModule]
    })
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .compile()

    const passedModules = createTestingModuleSpy.mock.calls[0][0]
    expect(passedModules.imports).toContain(BedrockModule)

    createTestingModuleSpy.mockRestore()
  })
})
