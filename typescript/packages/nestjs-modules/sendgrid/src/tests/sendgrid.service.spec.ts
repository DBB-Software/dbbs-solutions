import Sendgrid from '@sendgrid/mail'
import { jest } from '@jest/globals'
import { ValidationError } from '@dbbs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { SendgridService } from '../sendgrid.service.js'
import { MOCK_EMAIL, MOCK_SEND_EMAIL_PAYLOAD, MOCK_SEND_RESPONSE } from './mocks/sendgrid.mock.js'

describe(SendgridService.name, () => {
  let service: SendgridService

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'SENDGRID_API_KEY') return 'SGtest-api-key'
        if (key === 'SENDGRID_AUTHORIZE_EMAIL') return MOCK_EMAIL
        return undefined
      })
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [SendgridService, { provide: ConfigService, useValue: mockConfigService }]
    }).compile()

    service = module.get<SendgridService>(SendgridService)
  })

  describe(SendgridService.prototype.sendEmail.name, () => {
    beforeEach(() => {
      jest.spyOn(Sendgrid, 'setApiKey').mockImplementation(() => {})
      jest.spyOn(Sendgrid, 'send').mockResolvedValue(MOCK_SEND_RESPONSE)
    })

    it.each([
      {
        name: 'should send email with correct input params',
        params: MOCK_SEND_EMAIL_PAYLOAD,
        expectedResult: MOCK_SEND_RESPONSE
      },
      {
        name: 'should throw validation error for missing subject',
        params: { ...MOCK_SEND_EMAIL_PAYLOAD, subject: '' },
        expectedError: new ValidationError('Missing required fields: subject')
      },
      {
        name: 'should throw validation error for missing text or html',
        params: { ...MOCK_SEND_EMAIL_PAYLOAD, text: '', html: '' },
        expectedError: new ValidationError('Missing required fields: text or html must be provided')
      }
    ])('$name', async ({ params, expectedResult, expectedError }) => {
      if (expectedResult) {
        await expect(service.sendEmail(params)).resolves.toEqual(expectedResult)
      } else {
        expect(() => service.sendEmail(params)).toThrow(expectedError)
      }
    })
  })
})
