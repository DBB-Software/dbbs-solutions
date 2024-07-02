import { factories } from '@strapi/strapi'
import { Stripe } from 'stripe'
import { errors } from '@strapi/utils'
import {
  AcceptInviteParams,
  AddUserParams,
  CreateOrganizationParams,
  DeleteOrganizationParams,
  GetOrganizationByIdParams,
  UpdateOrganizationParams,
  UpdateOwnerParams
} from '../interfaces'

export default factories.createCoreController('plugin::stripe-payment.organization', ({ strapi }) => ({
  async create(ctx) {
    const data = ctx.request.body as Omit<CreateOrganizationParams, 'ownerId'>
    const { user } = ctx.state

    const organizationData = { ...data, ownerId: user.id }
    const organization = await strapi.plugin('stripe-payment').service('organization').create(organizationData)
    ctx.send(organization)
  },

  async getOrganizationById(ctx) {
    const { id } = ctx.params as GetOrganizationByIdParams
    const organization = await strapi.plugin('stripe-payment').service('organization').getOrganizationById({ id })

    if (!organization) {
      throw new errors.NotFoundError(`Organization with ID ${id} was not found`)
    }

    ctx.send(organization)
  },

  async getOrganizations(ctx) {
    const organizations = await strapi.plugin('stripe-payment').service('organization').getOrganizations()
    ctx.send(organizations)
  },

  async update(ctx) {
    const { id } = ctx.params
    const { name } = ctx.request.body as Omit<UpdateOrganizationParams, 'id'>
    const organization = await strapi.plugin('stripe-payment').service('organization').update({ id, name })

    if (!organization) {
      throw new errors.NotFoundError(`Organization with ID ${id} not found`)
    }

    ctx.send(organization)
  },

  async delete(ctx) {
    const { id } = ctx.params as DeleteOrganizationParams
    const result = await strapi.plugin('stripe-payment').service('organization').delete({ id })

    if (!result) {
      throw new errors.NotFoundError(`Organization with ID ${id} was not found`)
    }

    ctx.send(result)
  },

  async updateOwner(ctx) {
    const { id } = ctx.params
    const { ownerId } = ctx.request.body as Omit<UpdateOwnerParams, 'id'>
    const organization = await strapi.plugin('stripe-payment').service('organization').updateOwner({ id, ownerId })

    if (!organization) {
      throw new errors.NotFoundError(`Organization with ID ${id} or user with ID ${ownerId} was not found`)
    }

    ctx.send(organization)
  },

  async addUser(ctx) {
    const { id: organizationId } = ctx.params

    const { recipientEmail } = ctx.request.body as Omit<AddUserParams, 'id'>

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

    const result = await strapi.plugin('stripe-payment').service('organization').acceptInvite(acceptInviteData)

    ctx.send(result)
  }
}))
