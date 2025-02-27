import { factories, Strapi } from '@strapi/strapi'
import createHttpError from 'http-errors'
import {
  AcceptInviteParams,
  AddUserParams,
  CreateOrganizationParams,
  CreateDefaultPaymentMethodUpdateCheckoutSessionParams,
  DeleteOrganizationParams,
  GetMyOrganizationsParams,
  GetOrganizationByIdParams,
  GetPaymentMethodParams,
  RemoveUserParams,
  SendOrganizationInviteNotificationParams,
  UpdateOrganizationParams,
  UpdateOwnerParams
} from '../interfaces'
import { InviteStatus } from '../enums'
import { getSendOrganizationInviteTemplate } from '../templates'

export default factories.createCoreService('plugin::stripe-payment.organization', ({ strapi }: { strapi: Strapi }) => ({
  async create(params: CreateOrganizationParams) {
    const { name, ownerId, email, quantity } = params

    const owner = await strapi.query('plugin::users-permissions.user').findOne({ where: { id: ownerId } })
    if (!owner) {
      return null
    }

    const customer = await strapi.plugin('stripe-payment').service('stripe').customers.create({
      name,
      email
    })

    const organization = await strapi.query('plugin::stripe-payment.organization').create({
      data: {
        name,
        customer_id: customer.id,
        owner_id: ownerId,
        users: [ownerId],
        quantity
      }
    })

    return organization
  },

  async getOrganizationById(params: GetOrganizationByIdParams) {
    const { id } = params

    const organization = await strapi.query('plugin::stripe-payment.organization').findOne({
      where: { id },
      populate: ['subscription', 'subscription.plan', 'users', 'purchases', 'purchases.plan', 'purchases.plan.product']
    })

    if (!organization) {
      return null
    }

    return organization
  },

  async getUserOrganizations(params: GetMyOrganizationsParams) {
    const { userId } = params

    const organizations = await strapi.query('plugin::stripe-payment.organization').findMany({
      where: {
        users: {
          id: userId
        }
      },
      populate: ['users']
    })

    return organizations
  },

  async getAllOrganizations() {
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

    if (organization.subscription) {
      const stripeSubscription = await strapi
        .plugin('stripe-payment')
        .service('stripe')
        .subscriptions.retrieve(organization.subscription.stripe_id)

      if (stripeSubscription?.items?.data[0]?.quantity && quantity < stripeSubscription?.items?.data[0]?.quantity) {
        throw new createHttpError.BadRequest(
          'The new quantity value cannot be less than the current subscription quantity.'
        )
      }
    }

    await strapi.plugin('stripe-payment').service('stripe').customers.update(organization.customer_id, {
      name
    })

    return strapi.query('plugin::stripe-payment.organization').update({
      where: { id: organization.id },
      data: {
        name,
        quantity
      }
    })
  },

  async getDefaultPaymentMethod(params: GetPaymentMethodParams) {
    const { id } = params

    const organization = await strapi.query('plugin::stripe-payment.organization').findOne({ where: { id } })

    if (!organization) {
      return null
    }

    const { customer_id: customerId, payment_method_id: paymentMethodId } = organization
    const paymentMethod = await strapi
      .plugin('stripe-payment')
      .service('stripe')
      .customers.retrievePaymentMethod(customerId, paymentMethodId)

    const { brand, exp_month: expMonth, exp_year: expYear, last4 } = paymentMethod.card
    return { brand, expMonth, expYear, last4 }
  },

  async delete(params: DeleteOrganizationParams) {
    const { id } = params

    const organization = await strapi.query('plugin::stripe-payment.organization').findOne({ where: { id } })
    if (!organization) {
      return null
    }

    await strapi.plugin('stripe-payment').service('stripe').customers.del(organization.customer_id)

    await strapi.query('plugin::stripe-payment.organization').delete({ where: { id } })

    return { id }
  },

  async updateOwner(params: UpdateOwnerParams) {
    const { id, ownerId } = params

    const organization = await strapi.query('plugin::stripe-payment.organization').findOne({
      where: { id },
      populate: ['users']
    })

    if (!organization) {
      return null
    }

    if (!organization.users.find((user) => user.id === ownerId)) {
      throw new createHttpError.BadRequest(
        `Cannot update owner of the organization since the user with ID ${ownerId} is not a member of the organization`
      )
    }

    return strapi.query('plugin::stripe-payment.organization').update({
      where: { id: organization.id },
      data: {
        owner_id: ownerId
      }
    })
  },

  async createDefaultPaymentMethodUpdateCheckoutSession(params: CreateDefaultPaymentMethodUpdateCheckoutSessionParams) {
    const { id } = params

    const organization = await strapi.query('plugin::stripe-payment.organization').findOne({ where: { id } })

    if (!organization) {
      return null
    }

    return strapi
      .plugin('stripe-payment')
      .service('stripe')
      .checkout.sessions.create({
        customer: organization.customer_id,
        success_url: strapi.config.get('server.stripe.successSetupUrl'),
        mode: 'setup',
        currency: strapi.config.get('server.stripe.currency')
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

    await strapi.query('plugin::stripe-payment.invite').create({
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
    const organization = await strapi.query('plugin::stripe-payment.organization').findOne({
      where: { id: organizationId },
      populate: {
        users: true
      }
    })

    if (!organization) {
      return null
    }

    if (userId === Number(organization.owner_id)) {
      throw new createHttpError.BadRequest('Cannot remove an organization owner')
    }

    const userToRemove = organization.users.find((user) => user.id === userId)
    if (!userToRemove) {
      throw new createHttpError.BadRequest(`User with ID ${userId} is not a member of the organization`)
    }

    const organizationUsers = organization.users.filter((user) => user.id !== Number(userId))

    return strapi.query('plugin::stripe-payment.organization').update({
      where: { id: organizationId },
      data: {
        users: organizationUsers
      }
    })
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
    const domainUrl = strapi.config.get('server.stripe.domainUrl')
    const acceptInviteLink = `${domainUrl}/organization/${organizationId}/accept-invite?token=${inviteToken}`

    return strapi
      .plugin('stripe-payment')
      .service('notification')
      .sendEmail({
        subject: `Invite to organization ${organizationName}`,
        recipientsEmails: [recipientEmail],
        message: getSendOrganizationInviteTemplate({ organizationName, recipientEmail, acceptInviteLink })
      })
  }
}))
