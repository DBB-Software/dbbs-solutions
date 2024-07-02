import { factories, Strapi } from '@strapi/strapi'
import { errors } from '@strapi/utils'
import {
  CreateCheckoutSessionParams,
  GetSubscriptionByIdParams,
  PauseSubscriptionParams,
  ResumeSubscriptionParams,
  UpdateSubscriptionParams,
  ResubscribeParams
} from '../interfaces'

export default factories.createCoreController(
  'plugin::stripe-payment.subscription',
  ({ strapi }: { strapi: Strapi }) => ({
    async createCheckoutSession(ctx) {
      const { organizationName, planId, quantity } = ctx.request.body as Omit<CreateCheckoutSessionParams, 'userId'>
      const { user } = ctx.state

      const checkoutSessionLink = await strapi.plugin('stripe-payment').service('subscription').createCheckoutSession({
        userId: user.id,
        organizationName,
        planId,
        quantity
      })

      ctx.send(checkoutSessionLink)
    },

    async getSubscriptionById(ctx) {
      const { id } = ctx.params as GetSubscriptionByIdParams
      const subscription = await strapi.plugin('stripe-payment').service('subscription').getSubscriptionById({ id })

      if (!subscription) {
        throw new errors.NotFoundError(`Subscription with ID ${id} not found`)
      }

      ctx.send(subscription)
    },

    async getMySubscription(ctx) {
      const { user } = ctx.state

      const subscription = await strapi
        .plugin('stripe-payment')
        .service('subscription')
        .getMySubscription({ userId: user.id })

      ctx.send(subscription)
    },

    async getSubscriptions(ctx) {
      const subscriptions = await strapi.plugin('stripe-payment').service('subscription').getSubscriptions()

      ctx.send(subscriptions)
    },

    async cancelSubscription(ctx) {
      const { id } = ctx.params as PauseSubscriptionParams

      const result = await strapi.plugin('stripe-payment').service('subscription').cancelSubscription({ id })

      if (!result) {
        throw new errors.NotFoundError(`Subscription with ID: ${id} not found`)
      }

      ctx.send(result)
    },

    async pauseSubscription(ctx) {
      const { id } = ctx.params as PauseSubscriptionParams
      console.log(ctx.params, id)

      const subscription = await strapi.plugin('stripe-payment').service('subscription').pauseSubscription({ id })

      if (!subscription) {
        throw new errors.NotFoundError(`Subscription with ID: ${id} not found`)
      }

      ctx.send(subscription)
    },

    async resumeSubscription(ctx) {
      const { id } = ctx.params as ResumeSubscriptionParams

      const subscription = await strapi.plugin('stripe-payment').service('subscription').resumeSubscription({ id })

      if (!subscription) {
        throw new errors.NotFoundError(`Subscription with ID: ${id} not found`)
      }

      ctx.send(subscription)
    },

    async updateStripeSubscription(ctx) {
      const { id } = ctx.params
      const { quantity, planId } = ctx.request.body as Omit<UpdateSubscriptionParams, 'id'>

      const subscription = await strapi.plugin('stripe-payment').service('subscription').updateStripeSubscription({
        id,
        quantity,
        planId
      })

      if (!subscription) {
        throw new errors.NotFoundError(`Subscription with ID: ${id} not found`)
      }

      ctx.send(subscription)
    },

    async resubscribe(ctx) {
      const { id } = ctx.params as ResubscribeParams

      const result = await strapi.plugin('stripe-payment').service('subscription').resubscribe({ id })

      if (!result) {
        throw new errors.NotFoundError(`Subscription with ID ${id} not found`)
      }

      ctx.send(result)
    }
  })
)
