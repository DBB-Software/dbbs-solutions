import createHttpError from 'http-errors'
import { factories } from '@strapi/strapi'
import {
  AcceptInviteParams,
  AddUserParams,
  CreateOrganizationParams,
  CreateDefaultPaymentMethodUpdateCheckoutSessionParams,
  DeleteOrganizationParams,
  GetOrganizationByIdParams,
  GetPaymentMethodParams,
  UpdateOrganizationParams,
  UpdateOwnerParams,
  RemoveUserParams
} from '../interfaces'
import {
  createOrganizationSchema,
  updateOrganizationSchema,
  getOrganizationByIdSchema,
  deleteOrganizationSchema,
  updateOwnerSchema,
  addUserSchema,
  removeUserSchema,
  acceptInviteSchema,
  getDefaultPaymentMethodSchema,
  updateDefaultPaymentMethodSchema,
  createOrganizationByAdminSchema
} from '../validationSchemas'
import { validateWithYupSchema } from '../helpers'

export default factories.createCoreController('plugin::stripe-payment.organization', ({ strapi }) => ({
  async create(ctx) {
    const { name, email, quantity } = ctx.request.body as Omit<CreateOrganizationParams, 'ownerId'>
    const {
      user: { id: ownerId }
    } = ctx.state

    const validatedParams = await validateWithYupSchema(createOrganizationSchema, { name, email, quantity })

    const organization = await strapi
      .plugin('stripe-payment')
      .service('organization')
      .create({
        ownerId,
        ...validatedParams
      })

    if (!organization) {
      throw new createHttpError.NotFound(`Cannot create an organization as the owner with ID ${ownerId} was not found`)
    }
    ctx.send(organization)
  },

  async createByAdmin(ctx) {
    const { name, ownerId, email, quantity } = ctx.request.body as CreateOrganizationParams

    const validatedParams = await validateWithYupSchema(createOrganizationByAdminSchema, {
      name,
      ownerId,
      email,
      quantity
    })

    const organization = await strapi.plugin('stripe-payment').service('organization').create(validatedParams)

    if (!organization) {
      throw new createHttpError.NotFound(`Cannot create an organization as the owner with ID ${ownerId} was not found`)
    }
    ctx.send(organization)
  },

  async getOrganizationById(ctx) {
    const { id } = ctx.params as GetOrganizationByIdParams

    const validatedParams = await validateWithYupSchema(getOrganizationByIdSchema, { id })

    const organization = await strapi
      .plugin('stripe-payment')
      .service('organization')
      .getOrganizationById(validatedParams)

    if (!organization) {
      throw new createHttpError.NotFound(`Organization with ID ${id} was not found`)
    }

    ctx.send(organization)
  },

  async getUserOrganizations(ctx) {
    const { user } = ctx.state

    const organizations = await strapi.plugin('stripe-payment').service('organization').getUserOrganizations({
      userId: user.id
    })

    ctx.send(organizations)
  },

  async getAllOrganizations(ctx) {
    const organizations = await strapi.plugin('stripe-payment').service('organization').getAllOrganizations()

    ctx.send(organizations)
  },

  async getDefaultPaymentMethod(ctx) {
    const { id } = ctx.params as GetPaymentMethodParams

    const validatedParams = await validateWithYupSchema(getDefaultPaymentMethodSchema, { id })

    const paymentMethod = await strapi
      .plugin('stripe-payment')
      .service('organization')
      .getDefaultPaymentMethod(validatedParams)

    if (!paymentMethod) {
      throw new createHttpError.NotFound(`Organization with ID ${id} was not found`)
    }

    ctx.send(paymentMethod)
  },

  async update(ctx) {
    const { id } = ctx.params
    const { quantity, name } = ctx.request.body as Omit<UpdateOrganizationParams, 'id'>

    const validatedParams = await validateWithYupSchema(updateOrganizationSchema, { id, quantity, name })

    const organization = await strapi.plugin('stripe-payment').service('organization').update(validatedParams)

    if (!organization) {
      throw new createHttpError.NotFound(`Organization with ID ${id} not found`)
    }

    ctx.send(organization)
  },

  async delete(ctx) {
    const { id } = ctx.params as DeleteOrganizationParams

    const validatedParams = await validateWithYupSchema(deleteOrganizationSchema, { id })

    const result = await strapi.plugin('stripe-payment').service('organization').delete(validatedParams)

    if (!result) {
      throw new createHttpError.NotFound(`Organization with ID ${id} was not found`)
    }

    ctx.send(result)
  },

  async updateOwner(ctx) {
    const { id } = ctx.params
    const { ownerId } = ctx.request.body as Omit<UpdateOwnerParams, 'id'>

    const validatedParams = await validateWithYupSchema(updateOwnerSchema, { id, ownerId })

    const organization = await strapi.plugin('stripe-payment').service('organization').updateOwner(validatedParams)

    if (!organization) {
      throw new createHttpError.NotFound(`Organization with ID ${id} or user with ID ${ownerId} was not found`)
    }

    ctx.send(organization)
  },

  async createDefaultPaymentMethodUpdateCheckoutSession(ctx) {
    const { id } = ctx.params as CreateDefaultPaymentMethodUpdateCheckoutSessionParams

    const validatedParams = await validateWithYupSchema(updateDefaultPaymentMethodSchema, { id })

    const checkoutSession = await strapi
      .plugin('stripe-payment')
      .service('organization')
      .createDefaultPaymentMethodUpdateCheckoutSession(validatedParams)

    if (!checkoutSession) {
      throw new createHttpError.NotFound(`Organization with ID ${id} was not found`)
    }

    ctx.send(checkoutSession)
  },

  async addUser(ctx) {
    const { id: organizationId } = ctx.params
    const { recipientEmail } = ctx.request.body as Omit<AddUserParams, 'id'>

    const validatedParams = await validateWithYupSchema(addUserSchema, { organizationId, recipientEmail })

    const organization = await strapi.plugin('stripe-payment').service('organization').addUser(validatedParams)

    if (!organization) {
      throw new createHttpError.NotFound(`Organization with ID ${organizationId} was not found`)
    }

    ctx.send(organization)
  },

  async removeUser(ctx) {
    const { id: organizationId } = ctx.params
    const { userId } = ctx.request.body as Omit<RemoveUserParams, 'organizationId'>

    const validatedParams = await validateWithYupSchema(removeUserSchema, { organizationId, userId })

    const organization = await strapi.plugin('stripe-payment').service('organization').removeUser(validatedParams)

    if (!organization) {
      throw new createHttpError.NotFound(`Organization with ID ${organizationId} was not found`)
    }

    ctx.send(organization)
  },

  async acceptInvite(ctx) {
    const { id: organizationId } = ctx.params
    const { user } = ctx.state
    const { token } = ctx.request.body as Omit<AcceptInviteParams, 'userId'>

    const validatedParams = await validateWithYupSchema(acceptInviteSchema, { organizationId, userId: user.id, token })

    const result = await strapi.plugin('stripe-payment').service('organization').acceptInvite(validatedParams)

    ctx.send(result)
  }
}))
