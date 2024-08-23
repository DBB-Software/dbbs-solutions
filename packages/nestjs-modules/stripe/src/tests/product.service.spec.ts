import { Test, TestingModule } from '@nestjs/testing'
import { ProductService } from '../services/product.service.js'
import { STRIPE_SDK } from '../constants.js'
import { Stripe } from 'stripe'
import createHttpError from 'http-errors'
import {
  productListMock,
  defaultProduct,
  deletedProduct,
  getMockedMethod,
  ResourceName,
  ResourceMethods
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
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      const result = await service.create(serviceMethodArgs)
      expect(result).toEqual(expectedResult)

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
        name: 'should throw an error if product by id is not found',
        serviceMethodArgs: { id: 'prod_999' },
        expectedResult: new createHttpError.NotFound('Product with ID prod_999 not found'),
        expectedParams: {
          productsRetrieve: 'prod_999'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.products, 'retrieve').mockRejectedValue(new Error('Not Found'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      const mockedMethod = getMockedMethod(stripeMock, 'products', 'retrieve')
      try {
        const result = await service.getProductById(serviceMethodArgs)
        expect(result).toEqual(expectedResult)

        expect(mockedMethod).toHaveBeenCalledWith(expectedParams.productsRetrieve)
      } catch (error) {
        expect(error).toEqual(expectedResult)

        expect(mockedMethod).toHaveBeenCalledWith(expectedParams.productsRetrieve)
      }
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
        name: 'should throw an error if there is an issue fetching products',
        expectedResult: new createHttpError.NotFound('Error fetching products'),
        setupMocks: () => {
          jest.spyOn(stripeMock.products, 'list').mockRejectedValue(new Error('Fetch error'))
        }
      }
    ])('$name', async ({ expectedResult, setupMocks }) => {
      setupMocks()

      try {
        const result = await service.getProducts()
        expect(result).toEqual(expectedResult)
      } catch (error) {
        expect(error).toEqual(expectedResult)
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
          productsRetrieve: 'prod_1',
          productsUpdate: ['prod_1', { name: 'Updated Product' }]
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.products, 'retrieve').mockResolvedValue(defaultProduct)
          jest.spyOn(stripeMock.products, 'update').mockResolvedValue(defaultProduct)
        }
      },
      {
        name: 'should throw an error if product to update is not found',
        serviceMethodArgs: { id: 'prod_999', name: 'Non-existing Product' },
        expectedResult: new createHttpError.NotFound('Product with ID prod_999 not found'),
        expectedParams: {
          productsRetrieve: 'prod_999'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.products, 'retrieve').mockRejectedValue(new Error('Not Found'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      const productsRetrieveMock = getMockedMethod(stripeMock, 'products', 'retrieve')
      try {
        const result = await service.update(serviceMethodArgs)
        expect(result).toEqual(expectedResult)

        const productsUpdateMock = getMockedMethod(stripeMock, 'products', 'update')
        expect(productsUpdateMock).toHaveBeenCalledWith(...expectedParams.productsUpdate!)
        expect(productsRetrieveMock).toHaveBeenCalledWith(expectedParams.productsRetrieve)
      } catch (error) {
        expect(error).toEqual(expectedResult)

        expect(productsRetrieveMock).toHaveBeenCalledWith(expectedParams.productsRetrieve)
      }
    })
  })

  describe('Delete', () => {
    it.each([
      {
        name: 'should delete a product',
        serviceMethodArgs: { id: 'prod_1' },
        expectedResult: deletedProduct,
        expectedParams: {
          productsRetrieve: 'prod_1',
          productsUpdate: 'prod_1'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.products, 'retrieve').mockResolvedValue(defaultProduct)
          jest.spyOn(stripeMock.products, 'del').mockResolvedValue(deletedProduct)
        }
      },
      {
        name: 'should throw an error if product to delete is not found',
        serviceMethodArgs: { id: 'prod_999' },
        expectedResult: new createHttpError.NotFound('Product with ID prod_999 not found'),
        expectedParams: {
          productsRetrieve: 'prod_999'
        },
        setupMocks: () => {
          jest.spyOn(stripeMock.products, 'retrieve').mockRejectedValue(new Error('Not Found'))
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      const productsRetrieveMock = getMockedMethod(stripeMock, 'products', 'retrieve')
      try {
        const result = await service.delete(serviceMethodArgs)
        expect(result).toEqual(expectedResult)

        const productsUpdateMock = getMockedMethod(stripeMock, 'products', 'del')
        expect(productsUpdateMock).toHaveBeenCalledWith(expectedParams.productsUpdate)
        expect(productsRetrieveMock).toHaveBeenCalledWith(expectedParams.productsRetrieve)
      } catch (error) {
        expect(error).toEqual(expectedResult)

        expect(productsRetrieveMock).toHaveBeenCalledWith(expectedParams.productsRetrieve)
      }
    })
  })
})
