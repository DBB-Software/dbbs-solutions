import { jest } from '@jest/globals'
import { beforeEach, expect } from '@jest/globals'
import { Test, TestingModule } from '@nestjs/testing'
import { createProductDto, defaultProduct, deletedProduct } from '../mocks/index.js'
import { ProductController } from '../../controllers/product.controller.js'
import { ProductService } from '../../services/product.service.js'
import { ArgumentError, NotFoundError } from '@dbbs/common'
import { LoggerModule } from '@dbbs/nestjs-module-logger'

describe('ProductController', () => {
  let controller: ProductController
  let productService: jest.Mocked<ProductService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot({})],
      controllers: [ProductController],
      providers: [

        {
          provide: ProductService,
          useValue: {
            getProducts: jest.fn(),
            getProductById: jest.fn(),
            createProduct: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<ProductController>(ProductController)
    productService = module.get(ProductService) as jest.Mocked<ProductService>
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getProducts', () => {
    it.each([
      {
        name: 'should return products and apply default pagination with empty options provided',
        controllerMethodArgs: {},
        expectedResult: { items: [defaultProduct], total: 1, page: 1, perPage: 10 },
        expectedParams: { page: 1, perPage: 10 },
        setupMocks: () => {
          productService.getProducts.mockResolvedValue({ items: [defaultProduct], total: 1, page: 1, perPage: 10 })
        }
      },
      {
        name: 'should apply default pagination with custom options provided',
        controllerMethodArgs: { page: 5, perPage: 4 },
        expectedParams: { page: 5, perPage: 4 }
      },
      {
        name: 'should apply default pagination with custom page provided',
        controllerMethodArgs: { page: 2 },
        expectedParams: { page: 2, perPage: 10 }
      },
      {
        name: 'should apply default pagination with custom perPage provided',
        controllerMethodArgs: { perPage: 3 },
        expectedParams: { page: 1, perPage: 3 }
      },
      {
        name: 'should throw an error if failed to fetch products',
        controllerMethodArgs: { page: 1, perPage: 10 },
        expectedError: new Error('Something went wrong'),
        expectedParams: { page: 1, perPage: 10 },
      }
    ])('$name', async ({ controllerMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      if (setupMocks) {
        setupMocks()
      }

      try {
        const result = await controller.getProducts(controllerMethodArgs)

        if (expectedResult) {
          expect(result).toEqual(expectedResult)
        }
      } catch (error) {
        expect(error).toEqual(expectedError)
      }

      expect(productService.getProducts).toHaveBeenCalledWith(expectedParams)
    })
  })

  describe('getProductById', () => {
    it.each([
      {
        name: 'should return the product by ID',
        controllerMethodArgs: 1,
        expectedResult: defaultProduct,
        expectedParams: {
          productRetrieveById: 1
        },
        setupMocks: () => {
          productService.getProductById.mockResolvedValue(defaultProduct)
        }
      },
      {
        name: 'should throw an error if failed to fetch product',
        controllerMethodArgs: 1,
        expectedError: new Error('Something went wrong'),
        expectedParams: {
          productRetrieveById: 1
        },
        setupMocks: () => {
          productService.getProductById.mockRejectedValue(new Error('Something went wrong'))
        }
      },
      {
        name: 'should throw NotFound if product does not exist',
        controllerMethodArgs: 999,
        expectedError: new NotFoundError('Product with ID 999 was not found'),
        expectedParams: {
          productRetrieveById: 999
        },
        setupMocks: () => {
          productService.getProductById.mockResolvedValue(null)
        }
      }
    ])('$name', async ({ controllerMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()
      try {
        const result = await controller.getProductById(controllerMethodArgs)
        expect(result).toEqual(expectedResult)
      } catch (error) {
        expect(error).toEqual(expectedError)
      }
      expect(productService.getProductById).toHaveBeenCalledWith(expectedParams.productRetrieveById)
    })
  })

  describe('createProduct', () => {
    it.each([
      {
        name: 'should create a product',
        controllerMethodArgs: createProductDto,
        expectedResult: defaultProduct,
        expectedParams: {
          productCreate: { name: 'Product 1' }
        },
        setupMocks: () => {
          productService.createProduct.mockResolvedValue(defaultProduct)
        }
      },
      {
        name: 'should throw an error if failed to create a product',
        controllerMethodArgs: createProductDto,
        expectedError: new Error('Something went wrong'),
        expectedParams: {
          productCreate: { name: 'Product 1' }
        },
        setupMocks: () => {
          productService.createProduct.mockRejectedValue(new Error('Something went wrong'))
        }
      }
    ])('$name', async ({ controllerMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()
      try {
        const result = await controller.createProduct(controllerMethodArgs)
        expect(result).toEqual(expectedResult)
      } catch (error) {
        expect(error).toEqual(expectedError)
      }
      expect(productService.createProduct).toHaveBeenCalledWith(expectedParams.productCreate)
    })
  })

  describe('updateProduct', () => {
    it.each([
      {
        name: 'should update a product by ID',
        controllerMethodArgs: { id: 1, dto: createProductDto },
        expectedResult: defaultProduct,
        expectedParams: {
          productUpdate: {
            id: 1,
            name: 'Product 1'
          }
        },
        setupMocks: () => {
          productService.updateProduct.mockResolvedValue(defaultProduct)
        }
      },
      {
        name: 'should throw an error if failed to update a product',
        controllerMethodArgs: { id: 1, dto: createProductDto },
        expectedError: new Error('Something went wrong'),
        expectedParams: {
          productUpdate: {
            id: 1,
            name: 'Product 1'
          }
        },
        setupMocks: () => {
          productService.updateProduct.mockRejectedValue(new Error('Something went wrong'))
        }
      },
    ])('$name', async ({ controllerMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      try {
        const result = await controller.updateProduct(controllerMethodArgs.id, controllerMethodArgs.dto)
        expect(result).toEqual(expectedResult)
      } catch (error) {
        expect(error).toEqual(expectedError)
      }

      expect(productService.updateProduct).toHaveBeenCalledWith(expectedParams.productUpdate)
    })
  })

  describe('deleteProduct', () => {
    it.each([
      {
        name: 'should delete a product by ID',
        controllerMethodArgs: 1,
        expectedResult: deletedProduct,
        expectedParams: {
          productDelete: { id: 1 }
        },
        setupMocks: () => {
          productService.deleteProduct.mockResolvedValue(true)
        }
      },
      {
        name: 'should throw an ArgumentError if attempting to delete a product with plans',
        controllerMethodArgs: 1,
        expectedError: new ArgumentError('You cannot delete a product with plans'),
        expectedParams: {
          productDelete: { id: 1 }
        },
        setupMocks: () => {
          productService.deleteProduct.mockRejectedValue(new ArgumentError('You cannot delete a product with plans'))
        }
      },
      {
        name: 'should throw an error if failed to delete a product',
        controllerMethodArgs: 1,
        expectedError: new Error('Something went wrong'),
        expectedParams: {
          productDelete: { id: 1 }
        },
        setupMocks: () => {
          productService.deleteProduct.mockRejectedValue(new Error('Something went wrong'))
        }
      }
    ])('$name', async ({ controllerMethodArgs, expectedResult, expectedError, expectedParams, setupMocks }) => {
      setupMocks()

      try {
        const result = await controller.deleteProduct(controllerMethodArgs)
        expect(result).toEqual(expectedResult)
      } catch (error) {
        expect(error).toEqual(expectedError)
      }

      expect(productService.deleteProduct).toHaveBeenCalledWith(expectedParams.productDelete)
    })
  })
})
