import { jest } from '@jest/globals'
import { Test, TestingModule } from '@nestjs/testing'
import { ProductService as StripeProductService } from '@dbbs/nestjs-module-stripe'
import { ArgumentError, NotFoundError } from '@dbbs/common'

import { ProductRepository } from '../../repositories/index.js'
import { ProductService } from '../../services/index.js'
import { defaultProduct, productWithoutPlans, stripeProduct } from '../mocks/index.js'

describe('ProductService', () => {
  let service: ProductService
  let stripeProductService: jest.Mocked<StripeProductService>
  let productRepository: jest.Mocked<ProductRepository>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: StripeProductService,
          useValue: {
            getProducts: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
          }
        },
        {
          provide: ProductRepository,
          useValue: {
            getProducts: jest.fn(),
            createProduct: jest.fn(),
            getProductById: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn()
          }
        }
      ]
    }).compile()

    service = module.get<ProductService>(ProductService)
    stripeProductService = module.get(StripeProductService) as jest.Mocked<StripeProductService>
    productRepository = module.get(ProductRepository) as jest.Mocked<ProductRepository>
  })

  describe('getProducts', () => {
    it.each([
      {
        name: 'should return products and apply default pagination with no options provided',
        serviceMethodArgs: undefined,
        expectedResult: { items: [defaultProduct], total: 1, page: 1, perPage: 10 },
        expectedParams: {
          paginationOptions: { skip: 0, limit: 10 }
        },
        setupMocks: () => {
          productRepository.getProducts.mockResolvedValue({ products: [defaultProduct], total: 1 })
        }
      },
      {
        name: 'should apply default pagination with empty options provided',
        serviceMethodArgs: {},
        expectedParams: {
          paginationOptions: { skip: 0, limit: 10 }
        },
        setupMocks: () => {
          productRepository.getProducts.mockResolvedValue({ products: [defaultProduct], total: 1 })
        }
      },
      {
        name: 'should apply custom pagination',
        serviceMethodArgs: { page: 2, perPage: 3 },
        expectedParams: {
          paginationOptions: { skip: 3, limit: 3 }
        },
        setupMocks: () => {
          productRepository.getProducts.mockResolvedValue({ products: [defaultProduct], total: 1 })
        }
      },
      {
        name: 'should apply custom page',
        serviceMethodArgs: { page: 2 },
        expectedParams: {
          paginationOptions: { skip: 10, limit: 10 }
        },
        setupMocks: () => {
          productRepository.getProducts.mockResolvedValue({ products: [defaultProduct], total: 1 })
        }
      },
      {
        name: 'should apply custom perPage',
        serviceMethodArgs: { perPage: 5 },
        expectedParams: {
          paginationOptions: { skip: 0, limit: 5 }
        },
        setupMocks: () => {
          productRepository.getProducts.mockResolvedValue({ products: [defaultProduct], total: 1 })
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      const result = await service.getProducts(serviceMethodArgs)

      if (expectedResult) {
        expect(result).toEqual(expectedResult)
      }

      const { paginationOptions } = expectedParams
      expect(productRepository.getProducts).toHaveBeenCalledWith(paginationOptions)
    })
  })

  describe('getProductById', () => {
    it.each([
      {
        name: 'should return the product by ID',
        serviceMethodArgs: 1,
        expectedResult: defaultProduct,
        expectedParams: {
          productRetrieveById: { id: 1, populatePlans: true }
        },
        setupMocks: () => {
          productRepository.getProductById.mockResolvedValue(defaultProduct)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      const result = await service.getProductById(serviceMethodArgs)

      expect(result).toEqual(expectedResult)

      const { id, populatePlans } = expectedParams.productRetrieveById
      expect(productRepository.getProductById).toHaveBeenCalledWith(id, populatePlans)
    })
  })

  describe('createProduct', () => {
    it.each([
      {
        name: 'should create a product',
        serviceMethodArgs: { name: 'Product 1' },
        expectedResult: defaultProduct,
        expectedParams: {
          stripeProductCreate: { name: 'Product 1' },
          productCreate: { name: 'Product 1', stripeId: 'prod_1' }
        },
        setupMocks: () => {
          stripeProductService.create.mockResolvedValue(stripeProduct)
          productRepository.createProduct.mockResolvedValue(defaultProduct)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedParams, setupMocks }) => {
      setupMocks()

      const result = await service.createProduct(serviceMethodArgs)

      expect(result).toEqual(expectedResult)
      expect(stripeProductService.create).toHaveBeenCalledWith(expectedParams.stripeProductCreate)
      expect(productRepository.createProduct).toHaveBeenCalledWith(expectedParams.productCreate)
    })
  })

  describe('updateProduct', () => {
    it.each([
      {
        name: 'should update a product in Stripe and the repository',
        serviceMethodArgs: {
          id: 1,
          name: 'Product 1'
        },
        expectedResult: defaultProduct,
        expectedParams: {
          productRetrieveById: 1,
          stripeProductUpdate: { id: 'prod_1', name: 'Product 1' },
          productUpdate: { id: 1, name: 'Product 1' }
        },
        setupMocks: () => {
          productRepository.getProductById.mockResolvedValue(defaultProduct)
          stripeProductService.update.mockResolvedValue(stripeProduct)
          productRepository.updateProduct.mockResolvedValue(defaultProduct)
        }
      },
      {
        name: 'should throw an error if the product is not found',
        serviceMethodArgs: {
          id: 999,
          name: 'Product 1'
        },
        expectedError: new NotFoundError('Cannot update non-existing product with ID 999'),
        expectedParams: {
          productRetrieveById: 999
        },
        setupMocks: () => {
          productRepository.getProductById.mockResolvedValue(null)
        }
      },
      {
        name: 'should throw an error if product update returns null',
        serviceMethodArgs: {
          id: 1,
          name: 'Product 1'
        },
        expectedError: new Error('Failed to update a product with ID 1: the database update was unsuccessful'),
        expectedParams: {
          productRetrieveById: 1
        },
        setupMocks: () => {
          productRepository.getProductById.mockResolvedValue(defaultProduct)
          productRepository.updateProduct.mockResolvedValue(null)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      let result
      try {
        result = await service.updateProduct({
          id: serviceMethodArgs.id,
          name: serviceMethodArgs.name
        })

        expect(result).toEqual(expectedResult)
        expect(stripeProductService.update).toHaveBeenCalledWith(expectedParams.stripeProductUpdate)
        expect(productRepository.updateProduct).toHaveBeenCalledWith(expectedParams.productUpdate)
      } catch (error) {
        expect(error).toEqual(expectedError)
      }

      expect(productRepository.getProductById).toHaveBeenCalledWith(expectedParams.productRetrieveById)
    })
  })

  describe('deleteProduct', () => {
    it.each([
      {
        name: 'should delete a product',
        serviceMethodArgs: { id: 1 },
        expectedResult: true,
        expectedParams: {
          productRetrieveById: { id: 1, populatePlans: true },
          stripeProductDelete: { id: 'prod_1' },
          productDelete: 1
        },
        setupMocks: () => {
          productRepository.getProductById.mockResolvedValue(productWithoutPlans)
        }
      },
      {
        name: 'should throw an error if the product has associated plans',
        serviceMethodArgs: { id: 1 },
        expectedError: new ArgumentError('You cannot delete a product with plans'),
        expectedParams: {
          productRetrieveById: { id: 1, populatePlans: true }
        },
        setupMocks: () => {
          productRepository.getProductById.mockResolvedValue(defaultProduct)
        }
      },
      {
        name: 'should return true if the product is not found',
        serviceMethodArgs: { id: 999 },
        expectedResult: true,
        expectedParams: {
          productRetrieveById: { id: 999, populatePlans: true }
        },
        setupMocks: () => {
          productRepository.getProductById.mockResolvedValue(null)
        }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      try {
        const result = await service.deleteProduct(serviceMethodArgs)
        expect(result).toEqual(expectedResult)

        if (expectedParams.productDelete) {
          expect(stripeProductService.delete).toHaveBeenCalledWith(expectedParams.stripeProductDelete)
          expect(productRepository.deleteProduct).toHaveBeenCalledWith(expectedParams.productDelete)
        }
      } catch (error) {
        expect(error).toEqual(expectedError)
      }

      const { id, populatePlans } = expectedParams.productRetrieveById
      expect(productRepository.getProductById).toHaveBeenCalledWith(id, populatePlans)
    })
  })
})
