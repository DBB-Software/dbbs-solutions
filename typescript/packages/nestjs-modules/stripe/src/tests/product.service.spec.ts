import { Test, TestingModule } from '@nestjs/testing'
import { ProductService } from '../services/product.service.js'
import { STRIPE_SDK } from '../constants.js'
import { Stripe } from 'stripe'
import {
  productListMock,
  defaultProduct,
  deletedProduct,
  getMockedMethod
} from '../mocks/index.js'

describe('ProductService', () => {
  let service: ProductService
  let stripeMock: jest.Mocked<Stripe>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: STRIPE_SDK,
          useValue: {
            products: {
              create: jest.fn(),
              retrieve: jest.fn(),
              list: jest.fn(),
              update: jest.fn(),
              del: jest.fn()
            }
          }
        }
      ]
    }).compile()

    service = module.get<ProductService>(ProductService)
    stripeMock = module.get<Stripe>(STRIPE_SDK) as jest.Mocked<Stripe>
  })

  describe('Create', () => {
    it.each([
      {
        name: 'should create a product',
        serviceMethodArgs: { name: 'Test Product' },
        expectedResult: defaultProduct,
        expectedParams: {
          productsCreate: { name: 'Test Product' }
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.products, 'create').mockResolvedValue(defaultProduct)
        }
      },
      {
        name: 'should throw an error if failed to create a product',
        serviceMethodArgs: { name: 'Test Product' },
        expectedError: new Error('Failed to create a product'),
        expectedParams: {
          productsCreate: { name: 'Test Product' }
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.products, 'create').mockRejectedValue(new Error('Failed to create a product'))
        }
      },
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      const pendingResult = service.create(serviceMethodArgs)
      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
      }

      const mockedMethod = getMockedMethod(stripeMock, 'products', 'create')
      expect(mockedMethod).toHaveBeenCalledWith(expectedParams.productsCreate)
    })
  })

  describe('Get product by id', () => {
    it.each([
      {
        name: 'should get a product by id',
        serviceMethodArgs: { id: 'prod_1' },
        expectedResult: defaultProduct,
        expectedParams: {
          productsRetrieve: 'prod_1'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.products, 'retrieve').mockResolvedValue(defaultProduct)
        }
      },
      {
        name: 'should throw an error if failed to get product by id',
        serviceMethodArgs: { id: 'prod_1' },
        expectedError: new Error('Failed to get product'),
        expectedParams: {
          productsRetrieve: 'prod_1'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.products, 'retrieve').mockRejectedValue(new Error('Failed to get product'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      const pendingResult = service.getProductById(serviceMethodArgs)
      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
      }

      const mockedMethod = getMockedMethod(stripeMock, 'products', 'retrieve')
      expect(mockedMethod).toHaveBeenCalledWith(expectedParams.productsRetrieve)
    })
  })

  describe('Get Products', () => {
    it.each([
      {
        name: 'should get all products',
        expectedResult: productListMock.data,
        setupMocks: () => {
          jest.spyOn(stripeMock.products, 'list').mockResolvedValue(productListMock)
        }
      },
      {
        name: 'should throw an error if failed to get products',
        expectedError: new Error('Failed to get products'),
        setupMocks: () => {
          jest.spyOn(stripeMock.products, 'list').mockRejectedValue(new Error('Failed to get products'))
        }
      }
    ])('$name', async ({ expectedResult, expectedError, setupMocks }) => {
      setupMocks()

      const pendingResult = service.getProducts()
      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
      }
    })
  })

  describe('Update', () => {
    it.each([
      {
        name: 'should update a product',
        serviceMethodArgs: { id: 'prod_1', name: 'Updated Product' },
        expectedResult: defaultProduct,
        expectedParams: {
          productsUpdate: ['prod_1', { name: 'Updated Product' }]
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.products, 'update').mockResolvedValue(defaultProduct)
        }
      },
      {
        name: 'should throw an error failed to update product',
        serviceMethodArgs: { id: 'prod_1', name: 'Updated Product' },
        expectedError: new Error('Failed to update product'),
        expectedParams: {
          productsUpdate: ['prod_1', { name: 'Updated Product' }]
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.products, 'update').mockRejectedValue(new Error('Failed to update product'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      const pendingResult = service.update(serviceMethodArgs)
      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
      }

      const productsUpdateMock = getMockedMethod(stripeMock, 'products', 'update')
      expect(productsUpdateMock).toHaveBeenCalledWith(...expectedParams.productsUpdate!)
    })
  })

  describe('Delete', () => {
    it.each([
      {
        name: 'should delete a product',
        serviceMethodArgs: { id: 'prod_1' },
        expectedResult: deletedProduct,
        expectedParams: {
          productsDelete: 'prod_1'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.products, 'del').mockResolvedValue(deletedProduct)
        }
      },
      {
        name: 'should throw an error if failed to delete a product',
        serviceMethodArgs: { id: 'prod_1' },
        expectedError: new Error('Failed to delete product'),
        expectedParams: {
          productsDelete: 'prod_1'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.products, 'del').mockRejectedValue(new Error('Failed to delete product'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      const pendingResult = service.delete(serviceMethodArgs)
      if (expectedResult) {
        await expect(pendingResult).resolves.toEqual(expectedResult)
      } else {
        await expect(pendingResult).rejects.toMatchObject(expectedError)
      }

      const productsUpdateMock = getMockedMethod(stripeMock, 'products', 'del')
      expect(productsUpdateMock).toHaveBeenCalledWith(expectedParams.productsDelete)
    })
  })
})
