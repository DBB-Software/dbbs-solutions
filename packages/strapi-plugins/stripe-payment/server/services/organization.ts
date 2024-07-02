import { factories, Strapi } from '@strapi/strapi'
import createHttpError from 'http-errors'
import {
  AcceptInviteParams,
  AddUserParams,
  CreateOrganizationParams,
  DeleteOrganizationParams,
  GetOrganizationByIdParams,
  RemoveUserParams,
  SendOrganizationInviteNotificationParams,
  UpdateOrganizationParams,
  UpdateOwnerParams
} from '../interfaces'
import { InviteStatus } from '../enums'
import { getSendOrganizationInviteTemplate } from '../templates'

export default factories.createCoreService('plugin::stripe-payment.organization', ({ strapi }: { strapi: Strapi }) => ({
  async create(params: CreateOrganizationParams) {
    const { name, ownerId } = params

    const customer = await strapi.plugin('stripe-payment').service('stripe').customers.create({
      name
    })

    const organization = await strapi.query('plugin::stripe-payment.organization').create({
      data: {
        name,
        customer_id: customer.id,
        owner_id: ownerId,
        users: [ownerId]
      }
    })

    return organization
  },

  async getOrganizationById(params: GetOrganizationByIdParams) {
    const { id } = params

    const organization = await strapi.query('plugin::stripe-payment.organization').findOne({
      where: { id },
      populate: ['users']
    })

    if (!organization) {
      return null
    }

    return organization
  },

  async getOrganizations() {
    const organizations = await strapi.query('plugin::stripe-payment.organization').findMany({
      populate: ['users']
    })

    return organizations
  },

  async update(params: UpdateOrganizationParams) {
    const { name, id, quantity } = params

    const organization = await strapi
      .query('plugin::stripe-payment.organization')
      .findOne({ where: { id }, populate: { subscription: true } })

    if (!organization) {
      return null
    }

    const stripeSubscription = await strapi
      .plugin('stripe-payment')
      .service('stripe')
      .subscriptions.retrieve(organization.subscription.stripe_id)

    if (stripeSubscription?.items?.data[0]?.quantity && quantity < stripeSubscription?.items?.data[0]?.quantity) {
      throw new createHttpError.BadRequest(
        'The new quantity value cannot be less than the current subscription quantity.'
      )
    }

    const updatedOrganization = await strapi.query('plugin::stripe-payment.organization').update({
      where: { id: organization.id },
      data: {
        name,
        quantity
      }
    })

    return updatedOrganization
  },

  async delete(params: DeleteOrganizationParams) {
    const { id } = params

    const organization = await strapi.query('plugin::stripe-payment.organization').findOne({ where: { id } })

    await strapi.plugin('stripe-payment').service('stripe').customers.del(organization.customer_id)

    await strapi.query('plugin::stripe-payment.organization').delete({ where: { id } })

    return { id }
  },

  async updateOwner(params: UpdateOwnerParams) {
    const { id, ownerId } = params

    const organization = await strapi.query('plugin::stripe-payment.organization').findOne({ where: { id } })

    if (!organization) {
      return null
    }

    return strapi.query('plugin::stripe-payment.organization').update({
      where: { id: organization.id },
      data: {
        owner_id: ownerId
      }
    })
  },

  async addUser(params: AddUserParams) {
    const { organizationId, recipientEmail } = params

    const organization = await strapi.query('plugin::stripe-payment.organization').findOne({
      where: { id: organizationId },
      populate: {
        users: true,
        invites: {
          where: { status: InviteStatus.PENDING }
        }
      }
    })

    if (!organization) {
      return null
    }

    if (organization.quantity <= organization.users.length + organization.invites.length) {
      throw new createHttpError.BadRequest('Run out of available places in your organization, add new seats')
    }

    const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { email: recipientEmail } })

    const generatedInviteToken = crypto.randomUUID()

    const invite = await strapi.query('plugin::stripe-payment.invite').findOne({
      where: {
        email: recipientEmail,
        organization: organizationId,
        $or: [{ status: InviteStatus.PENDING }, { status: InviteStatus.ACCEPTED }]
      }
    })

    if (invite) {
      throw new createHttpError.BadRequest(`An invitation to ${organization.name} has already been sent to this email!`)
    }

    const res = await strapi.query('plugin::stripe-payment.invite').create({
      data: {
        token: generatedInviteToken,
        status: InviteStatus.PENDING,
        organization: organization.id,
        user: user?.id || undefined,
        email: recipientEmail
      }
    })

    if (!user) {
      return this.sendOrganizationInviteEmail({
        organizationName: organization.name,
        organizationId: organization.id,
        recipientEmail,
        inviteToken: generatedInviteToken
      })
    }

    return user
  },

  async removeUser(params: RemoveUserParams) {
    const { organizationId, userId } = params
    const organization = await strapi
      .query('plugin::stripe-payment.organization')
      .findOne({ where: { id: organizationId } })

    if (!organization) {
      return null
    }

    const organizationUsers = organization.users.filter((user) => user.id !== userId)

    if (!organizationUsers.length || organizationUsers.length === 0) {
      return null
    }

    const updatedOrganization = await strapi.query('plugin::stripe-payment.organization').update({
      where: { id: organizationId },
      data: {
        users: organizationUsers
      }
    })

    return updatedOrganization
  },

  async acceptInvite(params: AcceptInviteParams) {
    const { organizationId, userId, token } = params

    const invite = await strapi.query('plugin::stripe-payment.invite').findOne({
      where: {
        token,
        organization: organizationId,
        status: InviteStatus.PENDING
      }
    })

    if (!invite) {
      throw new createHttpError.NotFound(`Invite token ${token} for ${organizationId} not found`)
    }

    const organization = await strapi.query('plugin::stripe-payment.organization').findOne({
      where: { id: organizationId },
      populate: {
        users: true,
        subscription: true,
        invites: {
          where: {
            status: InviteStatus.PENDING
          }
        }
      }
    })

    if (organization.quantity <= organization.users.length + organization.invites.length) {
      throw new createHttpError.BadRequest('Run out of available places in your organization, add new seats')
    }

    const user = await strapi.query('plugin::users-permissions.user').findOne({
      where: { id: userId }
    })

    if (organization.users.some(({ id }) => id === user.id)) {
      throw new createHttpError.BadRequest('User already exists in organization!')
    }

    const stripeSubscription = await strapi
      .plugin('stripe-payment')
      .service('stripe')
      .subscriptions.retrieve(organization.subscription.stripe_id)

    if (stripeSubscription.items.data[0].quantity <= organization.users.length) {
      await strapi
        .plugin('stripe-payment')
        .service('stripe')
        .subscriptions.update(organization.subscription.stripe_id, {
          items: [
            {
              id: stripeSubscription.items.data[0].id,
              quantity: organization.users.length + 1
            }
          ]
        })
    }

    await strapi.query('plugin::stripe-payment.organization').update({
      where: { id: organizationId },
      data: {
        users: organization.users ? [...organization.users, user] : [user]
      }
    })

    await strapi.query('plugin::stripe-payment.invite').update({
      where: { id: invite.id },
      data: {
        status: InviteStatus.ACCEPTED
      }
    })

    return true
  },

  async sendOrganizationInviteEmail(params: SendOrganizationInviteNotificationParams) {
    const { organizationName, organizationId, recipientEmail, inviteToken } = params
    const sesSenderEmail: string = strapi.config.get('server.stripe.sesSenderEmail')
    const domainUrl = strapi.config.get('server.stripe.domainUrl')
    const acceptInviteLink = `${domainUrl}/organization/${organizationId}/accept-invite?token=${inviteToken}`

    return strapi
      .plugin('stripe-payment')
      .service('notification')
      .sendEmail({
        recipientsEmails: [recipientEmail],
        senderEmail: sesSenderEmail,
        message: getSendOrganizationInviteTemplate({ organizationName, recipientEmail, acceptInviteLink })
      })
  }
}))
