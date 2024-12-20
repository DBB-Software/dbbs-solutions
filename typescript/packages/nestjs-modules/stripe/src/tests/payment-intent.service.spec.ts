import Stripe from 'stripe'
import { Test, TestingModule } from '@nestjs/testing'
import { STRIPE_SDK } from '../constants.js'
import { PaymentIntentService } from '../services/payment-intent.service.js'
import { defaultPaymentIntent, getMockedMethod } from '../mocks/index.js'

describe('PaymentIntentService', () => {
  let service: PaymentIntentService
  let stripeMock: jest.Mocked<Stripe>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentIntentService,
        {
          provide: STRIPE_SDK,
          useValue: {
            paymentIntents: {
              retrieve: jest.fn()
            }
          }
        }
      ]
    }).compile()

    service = module.get<PaymentIntentService>(PaymentIntentService)
    stripeMock = module.get<Stripe>(STRIPE_SDK) as jest.Mocked<Stripe>
  })

  describe('Get payment intent by id', () => {
    it.each([
      {
        name: 'should get an payment intent by id',
        serviceMethodArgs: { id: 'pi_1' },
        expectedResult: defaultPaymentIntent,
        expectedParams: {
          paymentIntentRetrieve: 'pi_1'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.paymentIntents, 'retrieve').mockResolvedValue(defaultPaymentIntent)
        }
      },
      {
        name: 'should throw an error if failed to get payment intent by id',
        serviceMethodArgs: { id: 'pi_1' },
        expectedError: new Error('Error getting payment intent'),
        expectedParams: {
          paymentIntentRetrieve: 'pi_1'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.paymentIntents, 'retrieve').mockRejectedValue(new Error('Error getting payment intent'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      const retrievePaymentIntentMock = getMockedMethod(stripeMock, 'paymentIntents', 'retrieve')

      const pendingResult = service.getPaymentIntentById(serviceMethodArgs)
      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
      }

      expect(retrievePaymentIntentMock).toHaveBeenCalledWith(expectedParams.paymentIntentRetrieve)
    })
  })
})
