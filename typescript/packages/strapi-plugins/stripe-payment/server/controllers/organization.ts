import { factories } from '@strapi/strapi'
import { errors } from '@strapi/utils'
import {
  AcceptInviteParams,
  AddUserParams,
  CreateOrganizationParams,
  CreateDefaultPaymentMethodUpdateCheckoutSessionParams,
  DeleteOrganizationParams,
  GetOrganizationByIdParams,
  GetPaymentMethodParams,
  UpdateOrganizationParams,
  UpdateOwnerParams
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
  updateDefaultPaymentMethodSchema
} from '../validationSchemas'
import { validateWithYupSchema } from '../helpers'

export default factories.createCoreController('plugin::stripe-payment.organization', ({ strapi }) => ({
  async create(ctx) {
    const { name, email, quantity } = ctx.request.body as Omit<CreateOrganizationParams, 'ownerId'>
    const { user } = ctx.state

    await validateWithYupSchema(createOrganizationSchema, ctx.request.body)

    const organization = await strapi.plugin('stripe-payment').service('organization').create({
      ownerId: user.id,
      name,
      email,
      quantity
    })

    ctx.send(organization)
  },

  async createByAdmin(ctx) {
    const { name, ownerId, email, quantity } = ctx.request.body as CreateOrganizationParams

    await validateWithYupSchema(createOrganizationSchema, ctx.request.body)

    const organization = await strapi.plugin('stripe-payment').service('organization').create({
      name,
      ownerId,
      email,
      quantity
    })
    ctx.send(organization)
  },

  async getOrganizationById(ctx) {
    const { id } = ctx.params as GetOrganizationByIdParams

    await validateWithYupSchema(getOrganizationByIdSchema, { id })

    const organization = await strapi.plugin('stripe-payment').service('organization').getOrganizationById({ id })

    if (!organization) {
      throw new errors.NotFoundError(`Organization with ID ${id} was not found`)
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

    await validateWithYupSchema(getDefaultPaymentMethodSchema, { id })

    const paymentMethod = await strapi.plugin('stripe-payment').service('organization').getDefaultPaymentMethod({ id })

    if (!paymentMethod) {
      throw new errors.NotFoundError(`Organization with ID ${id} was not found`)
    }

    ctx.send(paymentMethod)
  },

  async update(ctx) {
    const { id } = ctx.params
    const { quantity, name } = ctx.request.body as Omit<UpdateOrganizationParams, 'id'>

    await validateWithYupSchema(updateOrganizationSchema, { id, quantity, name })

    const organization = await strapi.plugin('stripe-payment').service('organization').update({
      id,
      quantity,
      name
    })

    if (!organization) {
      throw new errors.NotFoundError(`Organization with ID ${id} not found`)
    }

    ctx.send(organization)
  },

  async delete(ctx) {
    const { id } = ctx.params as DeleteOrganizationParams

    await validateWithYupSchema(deleteOrganizationSchema, { id })

    const result = await strapi.plugin('stripe-payment').service('organization').delete({ id })

    if (!result) {
      throw new errors.NotFoundError(`Organization with ID ${id} was not found`)
    }

    ctx.send(result)
  },

  async updateOwner(ctx) {
    const { id } = ctx.params
    const { ownerId } = ctx.request.body as Omit<UpdateOwnerParams, 'id'>

    await validateWithYupSchema(updateOwnerSchema, { id, ownerId })

    const organization = await strapi.plugin('stripe-payment').service('organization').updateOwner({ id, ownerId })

    if (!organization) {
      throw new errors.NotFoundError(`Organization with ID ${id} or user with ID ${ownerId} was not found`)
    }

    ctx.send(organization)
  },

  async createDefaultPaymentMethodUpdateCheckoutSession(ctx) {
    const { id } = ctx.params as CreateDefaultPaymentMethodUpdateCheckoutSessionParams

    await validateWithYupSchema(updateDefaultPaymentMethodSchema, { id })

    const checkoutSession = await strapi
      .plugin('stripe-payment')
      .service('organization')
      .createDefaultPaymentMethodUpdateCheckoutSession({ id })

    if (!checkoutSession) {
      throw new errors.NotFoundError(`Organization with ID ${id} was not found`)
    }

    ctx.send(checkoutSession)
  },

  async addUser(ctx) {
    const { id: organizationId } = ctx.params
    const { recipientEmail } = ctx.request.body as Omit<AddUserParams, 'id'>

    await validateWithYupSchema(addUserSchema, { organizationId, recipientEmail })

    const organization = await strapi
      .plugin('stripe-payment')
      .service('organization')
      .addUser({ organizationId, recipientEmail })

    if (!organization) {
      throw new errors.NotFoundError(`Organization with ID ${organizationId} was not found`)
    }

    ctx.send(organization)
  },

  async removeUser(ctx) {
    const { id, userId } = ctx.params

    await validateWithYupSchema(removeUserSchema, { organizationId: id, userId })

    const organization = await strapi
      .plugin('stripe-payment')
      .service('organization')
      .removeUser({ organizationId: id, userId })

    if (!organization) {
      throw new errors.NotFoundError(`Organization with ID ${id} was not found`)
    }

    ctx.send(organization)
  },

  async acceptInvite(ctx) {
    const { id: organizationId } = ctx.params
    const { user } = ctx.state
    const { token } = ctx.request.body as Omit<AcceptInviteParams, 'userId'>

    const acceptInviteData = { organizationId, userId: user.id, token } as AcceptInviteParams

    await validateWithYupSchema(acceptInviteSchema, acceptInviteData)

    const result = await strapi.plugin('stripe-payment').service('organization').acceptInvite(acceptInviteData)

    ctx.send(result)
  }
}))
