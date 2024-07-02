import { Test, TestingModule } from '@nestjs/testing'
import { JwtStrategy } from './jwt.strategy.js'
import { ConfigService } from '@nestjs/config'

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy
  let configService: ConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'JWT_SECRET':
                  return 'test-secret'
                default:
                  return null
              }
            })
          }
        }
      ]
    }).compile()

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy)
    configService = module.get<ConfigService>(ConfigService)
  })

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined()
  })

  it('should validate the payload', () => {
    const payload = { sub: 1, username: 'testuser' }
    expect(jwtStrategy.validate(payload)).toEqual(payload)
  })
})
