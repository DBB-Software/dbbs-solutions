import createHttpError from 'http-errors'
import { Context } from 'koa'
import { Strapi } from '@strapi/strapi'
import productController from '../../server/controllers/product'
import { defaultProduct, strapiProductControllerMock, updatedProduct } from '../mocks'
import { createMockContext, createMockStrapi } from '../factories'

describe('Product Controller', () => {
  let strapi: Strapi

  beforeEach(() => {
    strapi = createMockStrapi(strapiProductControllerMock)
  })

  describe('Create', () => {
    it.each([
      {
        name: 'should create a product',
        ctxOverrides: { request: { body: { name: 'Test Product' } } },
        serviceMethodArgs: { name: 'Test Product' },
        expectedResult: defaultProduct
      }
    ])('$name', async ({ ctxOverrides, serviceMethodArgs, expectedResult }) => {
      const ctx = createMockContext(ctxOverrides as Partial<Context>)
      await productController({ strapi }).create(ctx)
      expect(strapi.plugin('stripe-payment').service('product').create).toBeCalledWith(serviceMethodArgs)
      expect(ctx.send).toBeCalledWith(expectedResult)
    })
  })

  describe('Get Product By Id', () => {
    it.each([
      {
        name: 'should get a product by id',
        ctxOverrides: { params: { id: 1 } },
        serviceMethodArgs: { id: 1 },
        expectedResult: defaultProduct
      },
      {
        name: 'should throw an error if product not found',
        ctxOverrides: { params: { id: 1 } },
        serviceMethodArgs: { id: 1 },
        error: createHttpError.NotFound
      }
    ])('$name', async ({ ctxOverrides, serviceMethodArgs, expectedResult, error }) => {
      const ctx = createMockContext(ctxOverrides as Partial<Context>)
      if (error) {
        strapi.plugin('stripe-payment').service('product').getProductById.mockResolvedValue(null)
        await expect(productController({ strapi }).getProductById(ctx)).rejects.toThrow(error)
      } else {
        await productController({ strapi }).getProductById(ctx)
        expect(strapi.plugin('stripe-payment').service('product').getProductById).toBeCalledWith(serviceMethodArgs)
        expect(ctx.send).toBeCalledWith(expectedResult)
      }
    })
  })

  describe('Get Products', () => {
    it.each([
      {
        name: 'should get all products',
        ctxOverrides: {},
        serviceMethodArgs: [],
        expectedResult: [defaultProduct]
      }
    ])('$name', async ({ ctxOverrides, serviceMethodArgs, expectedResult }) => {
      const ctx = createMockContext(ctxOverrides as Partial<Context>)
      await productController({ strapi }).getProducts(ctx)
      expect(strapi.plugin('stripe-payment').service('product').getProducts).toBeCalledWith(...serviceMethodArgs)
      expect(ctx.send).toBeCalledWith(expectedResult)
    })
  })

  describe('Update', () => {
    it.each([
      {
        name: 'should update a product',
        ctxOverrides: { params: { id: 1 }, request: { body: { name: 'Updated Product' } } },
        serviceMethodArgs: { id: 1, name: 'Updated Product' },
        expectedResult: updatedProduct
      },
      {
        name: 'should throw an error if updated product not found',
        ctxOverrides: { params: { id: 1 }, request: { body: { name: 'Updated Product' } } },
        serviceMethodArgs: { id: 1, name: 'Updated Product' },
        error: createHttpError.NotFound
      }
    ])('$name', async ({ ctxOverrides, serviceMethodArgs, expectedResult, error }) => {
      const ctx = createMockContext(ctxOverrides as unknown as Partial<Context>)
      if (error) {
        strapi.plugin('stripe-payment').service('product').update.mockResolvedValue(null)
        await expect(productController({ strapi }).update(ctx)).rejects.toThrow(error)
      } else {
        await productController({ strapi }).update(ctx)
        expect(strapi.plugin('stripe-payment').service('product').update).toBeCalledWith(serviceMethodArgs)
        expect(ctx.send).toBeCalledWith(expectedResult)
      }
    })
  })

  describe('Delete', () => {
    it.each([
      {
        name: 'should delete a product',
        ctxOverrides: { params: { id: 1 } },
        serviceMethodArgs: { id: 1 },
        expectedResult: { id: 1 }
      },
      {
        name: 'should throw an error if deleted product not found',
        ctxOverrides: { params: { id: 1 } },
        serviceMethodArgs: { id: 1 },
        error: createHttpError.NotFound
      }
    ])('$name', async ({ ctxOverrides, serviceMethodArgs, expectedResult, error }) => {
      const ctx = createMockContext(ctxOverrides as Partial<Context>)
      if (error) {
        strapi.plugin('stripe-payment').service('product').delete.mockResolvedValue(null)
        await expect(productController({ strapi }).delete(ctx)).rejects.toThrow(error)
      } else {
        await productController({ strapi }).delete(ctx)
        expect(strapi.plugin('stripe-payment').service('product').delete).toBeCalledWith(serviceMethodArgs)
        expect(ctx.send).toBeCalledWith(expectedResult)
      }
    })
  })
})
