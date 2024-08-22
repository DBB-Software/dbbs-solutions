import { Strapi } from '@strapi/strapi'
import productService from '../../server/services/product'
import { createMockStrapi } from '../factories'
import { defaultProduct, strapiProductServiceMock, updatedProduct } from '../mocks'

jest.mock('stripe')

describe('Product Service', () => {
  let strapi: Strapi

  beforeEach(() => {
    strapi = createMockStrapi(strapiProductServiceMock)
  })

  describe('Create', () => {
    it.each([
      {
        name: 'should create a product',
        serviceMethodArgs: { name: 'Test Product' },
        expectedResult: defaultProduct,
        stripeServiceMethod: 'create',
        stripeServiceArgs: [{ name: 'Test Product' }],
        setupMocks: () => {
          jest.spyOn(strapi.query('plugin::stripe-payment.product'), 'create').mockResolvedValue(defaultProduct)
        },
        queryMethod: 'create',
        queryArgs: { data: { name: 'Test Product', stripe_id: 1 } }
      }
    ])(
      '$name',
      async ({
        serviceMethodArgs,
        expectedResult,
        stripeServiceMethod,
        stripeServiceArgs,
        setupMocks,
        queryMethod,
        queryArgs
      }) => {
        setupMocks()

        const result = await productService({ strapi }).create(serviceMethodArgs)

        if (stripeServiceMethod && stripeServiceArgs) {
          expect(strapi.plugin('stripe-payment').service('stripe').products[stripeServiceMethod]).toBeCalledWith(
            ...stripeServiceArgs
          )
        }

        expect(strapi.query('plugin::stripe-payment.product')[queryMethod]).toBeCalledWith(queryArgs)
        expect(result).toEqual(expectedResult)
      }
    )
  })

  describe('Get Product By Id', () => {
    it.each([
      {
        name: 'should get a product by id',
        serviceMethodArgs: { id: 1 },
        expectedResult: defaultProduct,
        setupMocks: () => {
          jest.spyOn(strapi.query('plugin::stripe-payment.product'), 'findOne').mockResolvedValue(defaultProduct)
        },
        queryMethod: 'findOne',
        queryArgs: { where: { id: 1 }, populate: ['plans'] }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, setupMocks, queryMethod, queryArgs }) => {
      setupMocks()

      const result = await productService({ strapi }).getProductById(serviceMethodArgs)

      expect(strapi.query('plugin::stripe-payment.product')[queryMethod]).toBeCalledWith(queryArgs)
      expect(result).toEqual(expectedResult)
    })

    it.each([
      {
        name: 'should return null if product by id is not found',
        serviceMethodArgs: { id: 1 },
        expectedResult: null,
        setupMocks: () => {
          jest.spyOn(strapi.query('plugin::stripe-payment.product'), 'findOne').mockResolvedValue(null)
        },
        queryMethod: 'findOne',
        queryArgs: { where: { id: 1 }, populate: ['plans'] }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, setupMocks, queryMethod, queryArgs }) => {
      setupMocks()

      const result = await productService({ strapi }).getProductById(serviceMethodArgs)

      expect(strapi.query('plugin::stripe-payment.product')[queryMethod]).toBeCalledWith(queryArgs)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('Get Products', () => {
    it.each([
      {
        name: 'should get all products',
        expectedResult: [defaultProduct],
        stripeServiceMethod: 'list',
        stripeServiceArgs: [],
        setupMocks: () => {
          jest.spyOn(strapi.query('plugin::stripe-payment.product'), 'findMany').mockResolvedValue([defaultProduct])
        },
        queryMethod: 'findMany',
        queryArgs: { where: { stripe_id: { $in: [1] } }, populate: ['plans'] }
      }
    ])(
      '$name',
      async ({ expectedResult, stripeServiceMethod, stripeServiceArgs, setupMocks, queryMethod, queryArgs }) => {
        setupMocks()

        const result = await productService({ strapi }).getProducts()

        if (stripeServiceMethod && stripeServiceArgs) {
          expect(strapi.plugin('stripe-payment').service('stripe').products[stripeServiceMethod]).toBeCalledWith(
            ...stripeServiceArgs
          )
        }

        expect(strapi.query('plugin::stripe-payment.product')[queryMethod]).toBeCalledWith(queryArgs)
        expect(result).toEqual(expectedResult)
      }
    )
  })

  describe('Update', () => {
    it.each([
      {
        name: 'should update a product',
        serviceMethodArgs: { id: 1, name: 'Updated Product' },
        expectedResult: updatedProduct,
        stripeServiceMethod: 'update',
        stripeServiceArgs: [1, { name: 'Updated Product' }],
        setupMocks: () => {
          jest.spyOn(strapi.query('plugin::stripe-payment.product'), 'update').mockResolvedValue(updatedProduct)
          jest.spyOn(strapi.query('plugin::stripe-payment.product'), 'delete').mockResolvedValue(updatedProduct)
          jest.spyOn(strapi.query('plugin::stripe-payment.product'), 'findOne').mockResolvedValue(updatedProduct)
        },
        queryMethod: 'update',
        queryArgs: { where: { id: 1 }, data: { name: 'Updated Product' } }
      }
    ])(
      '$name',
      async ({
        serviceMethodArgs,
        expectedResult,
        stripeServiceMethod,
        stripeServiceArgs,
        setupMocks,
        queryMethod,
        queryArgs
      }) => {
        setupMocks()

        const result = await productService({ strapi }).update(serviceMethodArgs)

        if (stripeServiceMethod && stripeServiceArgs) {
          expect(strapi.plugin('stripe-payment').service('stripe').products[stripeServiceMethod]).toBeCalledWith(
            ...stripeServiceArgs
          )
        }

        expect(strapi.query('plugin::stripe-payment.product')[queryMethod]).toBeCalledWith(queryArgs)
        expect(result).toEqual(expectedResult)
      }
    )
  })

  describe('Delete', () => {
    it.each([
      {
        name: 'should delete a product',
        serviceMethodArgs: { id: 1 },
        expectedResult: { id: defaultProduct.id },
        setupMocks: () => {
          jest.spyOn(strapi.query('plugin::stripe-payment.product'), 'findOne').mockResolvedValue(defaultProduct)
          jest
            .spyOn(strapi.query('plugin::stripe-payment.product'), 'delete')
            .mockResolvedValue({ id: defaultProduct.id })
        },
        queryMethod: 'delete',
        queryArgs: { where: { id: 1 } }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, setupMocks, queryMethod, queryArgs }) => {
      setupMocks()

      const result = await productService({ strapi }).delete(serviceMethodArgs)

      expect(strapi.query('plugin::stripe-payment.product')[queryMethod]).toBeCalledWith(queryArgs)
      expect(result).toEqual(expectedResult)
    })

    it.each([
      {
        name: 'should throw an error if product to delete is not found',
        serviceMethodArgs: { id: 1 },
        expectedResult: null,
        setupMocks: () => {
          jest.spyOn(strapi.query('plugin::stripe-payment.product'), 'findOne').mockResolvedValue(null)
        },
        queryMethod: 'findOne',
        queryArgs: { where: { id: 1 }, populate: { plans: true } }
      }
    ])('$name', async ({ serviceMethodArgs, expectedResult, setupMocks, queryMethod, queryArgs }) => {
      setupMocks()

      const result = await productService({ strapi }).delete(serviceMethodArgs)

      expect(strapi.query('plugin::stripe-payment.product')[queryMethod]).toBeCalledWith(queryArgs)

      if (expectedResult !== null) {
        expect(result).toEqual(expectedResult)
      }
    })
  })
})
