import Stripe from 'stripe'
import { Test, TestingModule } from '@nestjs/testing'
import { STRIPE_SDK } from '../constants.js'
import { InvoiceService } from '../services/invoice.service.js'
import { defaultInvoice, getMockedMethod } from '../mocks/index.js'

describe('InvoiceService', () => {
  let service: InvoiceService
  let stripeMock: jest.Mocked<Stripe>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: STRIPE_SDK,
          useValue: {
            invoices: {
              retrieve: jest.fn()
            }
          }
        }
      ]
    }).compile()

    service = module.get<InvoiceService>(InvoiceService)
    stripeMock = module.get<Stripe>(STRIPE_SDK) as jest.Mocked<Stripe>
  })

  describe('Get invoice by id', () => {
    it.each([
      {
        name: 'should get an invoice by id',
        serviceMethodArgs: { id: 'inv_1' },
        expectedResult: defaultInvoice,
        expectedParams: {
          invoiceRetrieve: 'inv_1'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.invoices, 'retrieve').mockResolvedValue(defaultInvoice)
        }
      },
      {
        name: 'should throw an error if failed to get invoice by id',
        serviceMethodArgs: { id: 'inv_1' },
        expectedError: new Error('Error getting invoice'),
        expectedParams: {
          invoiceRetrieve: 'inv_1'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.invoices, 'retrieve').mockRejectedValue(new Error('Error getting invoice'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      const retrieveInvoiceMock = getMockedMethod(stripeMock, 'invoices', 'retrieve')

      const pendingResult = service.getInvoiceById(serviceMethodArgs)
      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
      }

      expect(retrieveInvoiceMock).toHaveBeenCalledWith(expectedParams.invoiceRetrieve)
    })
  })
})
