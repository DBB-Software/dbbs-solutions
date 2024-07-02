import { Context } from 'koa'
import { Strapi } from '@strapi/strapi'
import { errors } from '@strapi/utils'
import organizationController from '../../server/controllers/organization'
import { createMockContext, createMockStrapi } from '../factories'
import { defaultOrganization, updatedOrganization, strapiOrganizationControllerMock } from '../mocks'

describe('Organization Controller', () => {
  let strapi: Strapi

  beforeEach(() => {
    strapi = createMockStrapi(strapiOrganizationControllerMock)
  })

  describe('Create', () => {
    it.each([
      {
        name: 'should create an organization',
        ctxOverrides: { request: { body: { name: 'Test Organization' } }, state: { user: { id: 1 } } },
        serviceMethodArgs: { name: 'Test Organization', ownerId: 1 },
        expectedResult: defaultOrganization
      }
    ])('$name', async ({ ctxOverrides, serviceMethodArgs, expectedResult }) => {
      const ctx = createMockContext(ctxOverrides as Partial<Context>)
      await organizationController({ strapi }).create(ctx)
      expect(strapi.plugin('stripe-payment').service('organization').create).toBeCalledWith(serviceMethodArgs)
      expect(ctx.send).toBeCalledWith(expectedResult)
    })
  })

  describe('Get Organization By Id', () => {
    it.each([
      {
        name: 'should get an organization by id',
        ctxOverrides: { params: { id: 1 } },
        serviceMethodArgs: { id: 1 },
        expectedResult: defaultOrganization
      },
      {
        name: 'should throw an error if organization not found',
        ctxOverrides: { params: { id: 1 } },
        serviceMethodArgs: { id: 1 },
        error: errors.NotFoundError
      }
    ])('$name', async ({ ctxOverrides, serviceMethodArgs, expectedResult, error }) => {
      const ctx = createMockContext(ctxOverrides as Partial<Context>)
      if (error) {
        strapi.plugin('stripe-payment').service('organization').getOrganizationById.mockResolvedValue(null)
        await expect(organizationController({ strapi }).getOrganizationById(ctx)).rejects.toThrow(error)
      } else {
        await organizationController({ strapi }).getOrganizationById(ctx)
        expect(strapi.plugin('stripe-payment').service('organization').getOrganizationById).toBeCalledWith(
          serviceMethodArgs
        )
        expect(ctx.send).toBeCalledWith(expectedResult)
      }
    })
  })

  describe('Get Organizations', () => {
    it.each([
      {
        name: 'should get all organizations',
        ctxOverrides: {},
        serviceMethodArgs: [],
        expectedResult: [defaultOrganization]
      }
    ])('$name', async ({ ctxOverrides, serviceMethodArgs, expectedResult }) => {
      const ctx = createMockContext(ctxOverrides as Partial<Context>)
      await organizationController({ strapi }).getOrganizations(ctx)
      expect(strapi.plugin('stripe-payment').service('organization').getOrganizations).toBeCalledWith(
        ...serviceMethodArgs
      )
      expect(ctx.send).toBeCalledWith(expectedResult)
    })
  })

  describe('Update', () => {
    it.each([
      {
        name: 'should update an organization',
        ctxOverrides: { params: { id: 1 }, request: { body: { name: 'Updated Organization' } } },
        serviceMethodArgs: { id: 1, name: 'Updated Organization' },
        expectedResult: updatedOrganization
      },
      {
        name: 'should throw an error if updated organization not found',
        ctxOverrides: { params: { id: 1 }, request: { body: { name: 'Updated Organization' } } },
        serviceMethodArgs: { id: 1, name: 'Updated Organization' },
        error: errors.NotFoundError
      }
    ])('$name', async ({ ctxOverrides, serviceMethodArgs, expectedResult, error }) => {
      const ctx = createMockContext(ctxOverrides as unknown as Partial<Context>)
      if (error) {
        strapi.plugin('stripe-payment').service('organization').update.mockResolvedValue(null)
        await expect(organizationController({ strapi }).update(ctx)).rejects.toThrow(error)
      } else {
        await organizationController({ strapi }).update(ctx)
        expect(strapi.plugin('stripe-payment').service('organization').update).toBeCalledWith(serviceMethodArgs)
        expect(ctx.send).toBeCalledWith(expectedResult)
      }
    })
  })

  describe('Delete', () => {
    it.each([
      {
        name: 'should delete an organization',
        ctxOverrides: { params: { id: 1 } },
        serviceMethodArgs: { id: 1 },
        expectedResult: { id: 1 }
      },
      {
        name: 'should throw an error if deleted organization not found',
        ctxOverrides: { params: { id: 1 } },
        serviceMethodArgs: { id: 1 },
        error: errors.NotFoundError
      }
    ])('$name', async ({ ctxOverrides, serviceMethodArgs, expectedResult, error }) => {
      const ctx = createMockContext(ctxOverrides as Partial<Context>)
      if (error) {
        strapi.plugin('stripe-payment').service('organization').delete.mockResolvedValue(null)
        await expect(organizationController({ strapi }).delete(ctx)).rejects.toThrow(error)
      } else {
        await organizationController({ strapi }).delete(ctx)
        expect(strapi.plugin('stripe-payment').service('organization').delete).toBeCalledWith(serviceMethodArgs)
        expect(ctx.send).toBeCalledWith(expectedResult)
      }
    })
  })

  describe('Update Owner', () => {
    it.each([
      {
        name: 'should update organization owner',
        ctxOverrides: { params: { id: 1 }, request: { body: { ownerId: 2 } } },
        serviceMethodArgs: { id: 1, ownerId: 2 },
        expectedResult: { id: 1, name: 'Test Organization', owner_id: 2 }
      },
      {
        name: 'should throw an error if updated owner organization not found',
        ctxOverrides: { params: { id: 1 }, request: { body: { ownerId: 2 } } },
        serviceMethodArgs: { id: 1, ownerId: 2 },
        error: errors.NotFoundError
      }
    ])('$name', async ({ ctxOverrides, serviceMethodArgs, expectedResult, error }) => {
      const ctx = createMockContext(ctxOverrides as unknown as Partial<Context>)
      if (error) {
        strapi.plugin('stripe-payment').service('organization').updateOwner.mockResolvedValue(null)
        await expect(organizationController({ strapi }).updateOwner(ctx)).rejects.toThrow(error)
      } else {
        await organizationController({ strapi }).updateOwner(ctx)
        expect(strapi.plugin('stripe-payment').service('organization').updateOwner).toBeCalledWith(serviceMethodArgs)
        expect(ctx.send).toBeCalledWith(expectedResult)
      }
    })
  })

  describe('Remove User', () => {
    it.each([
      {
        name: 'should remove a user from an organization',
        ctxOverrides: { params: { id: 1, userId: 2 } },
        serviceMethodArgs: { organizationId: 1, userId: 2 },
        expectedResult: { id: 1, name: 'Test Organization', users: [] }
      },
      {
        name: 'should throw an error if removed user organization not found',
        ctxOverrides: { params: { id: 1, userId: 2 } },
        serviceMethodArgs: { id: 1, ownerId: 2 },
        error: errors.NotFoundError
      }
    ])('$name', async ({ ctxOverrides, serviceMethodArgs, expectedResult, error }) => {
      const ctx = createMockContext(ctxOverrides as Partial<Context>)
      if (error) {
        strapi.plugin('stripe-payment').service('organization').removeUser.mockResolvedValue(null)
        await expect(organizationController({ strapi }).removeUser(ctx)).rejects.toThrow(error)
      } else {
        await organizationController({ strapi }).removeUser(ctx)
        expect(strapi.plugin('stripe-payment').service('organization').removeUser).toBeCalledWith(serviceMethodArgs)
        expect(ctx.send).toBeCalledWith(expectedResult)
      }
    })
  })
})
