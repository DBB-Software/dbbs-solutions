import { factories, Strapi } from '@strapi/strapi'
import createHttpError from 'http-errors'
import {
  CreateCheckoutSessionParams,
  GetSubscriptionByIdParams,
  PauseSubscriptionParams,
  ResumeSubscriptionParams,
  UpdateSubscriptionParams,
  ResubscribeParams
} from '../interfaces'
import {
  createCheckoutSessionSchema,
  getSubscriptionByIdSchema,
  pauseSubscriptionSchema,
  resumeSubscriptionSchema,
  updateSubscriptionSchema,
  resubscribeSchema
} from '../validationSchemas'
import { validateWithYupSchema } from '../helpers'

export default factories.createCoreController(
  'plugin::stripe-payment.subscription',
  ({ strapi }: { strapi: Strapi }) => ({
    async createCheckoutSession(ctx) {
      const { quantity, planId, organizationName, organizationId } = ctx.request.body as Omit<
        CreateCheckoutSessionParams,
        'userId'
      >
      const { user } = ctx.state

      const validatedParams = await validateWithYupSchema(createCheckoutSessionSchema, {
        quantity,
        planId,
        organizationName,
        organizationId
      })

      const checkoutSessionLink = await strapi
        .plugin('stripe-payment')
        .service('subscription')
        .createCheckoutSession({
          userId: user.id,
          ...validatedParams
        })

      ctx.send({ url: checkoutSessionLink })
    },

    async getSubscriptionById(ctx) {
      const { id } = ctx.params as GetSubscriptionByIdParams

      const validatedParams = await validateWithYupSchema(getSubscriptionByIdSchema, { id })

      const subscription = await strapi
        .plugin('stripe-payment')
        .service('subscription')
        .getSubscriptionById(validatedParams)

      if (!subscription) {
        throw new createHttpError.NotFound(`Subscription with ID ${id} not found`)
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

      const validatedParams = await validateWithYupSchema(pauseSubscriptionSchema, { id })

      const result = await strapi.plugin('stripe-payment').service('subscription').cancelSubscription(validatedParams)

      if (!result) {
        throw new createHttpError.NotFound(`Subscription with ID: ${id} not found`)
      }

      ctx.send(result)
    },

    async pauseSubscription(ctx) {
      const { id } = ctx.params as PauseSubscriptionParams

      const validatedParams = await validateWithYupSchema(pauseSubscriptionSchema, { id })

      const subscription = await strapi
        .plugin('stripe-payment')
        .service('subscription')
        .pauseSubscription(validatedParams)

      if (!subscription) {
        throw new createHttpError.NotFound(`Subscription with ID: ${id} not found`)
      }

      ctx.send(subscription)
    },

    async resumeSubscription(ctx) {
      const { id } = ctx.params as ResumeSubscriptionParams

      const validatedParams = await validateWithYupSchema(resumeSubscriptionSchema, { id })

      const subscription = await strapi
        .plugin('stripe-payment')
        .service('subscription')
        .resumeSubscription(validatedParams)

      if (!subscription) {
        throw new createHttpError.NotFound(`Subscription with ID: ${id} not found`)
      }

      ctx.send(subscription)
    },

    async updateStripeSubscription(ctx) {
      const { id } = ctx.params
      const { quantity, planId } = ctx.request.body as Omit<UpdateSubscriptionParams, 'id'>

      const validatedParams = await validateWithYupSchema(updateSubscriptionSchema, { id, quantity, planId })

      const subscription = await strapi
        .plugin('stripe-payment')
        .service('subscription')
        .updateStripeSubscription(validatedParams)

      if (!subscription) {
        throw new createHttpError.NotFound(`Subscription with ID: ${id} not found`)
      }

      ctx.send(subscription)
    },

    async resubscribe(ctx) {
      const { id } = ctx.params as ResubscribeParams

      const validatedParams = await validateWithYupSchema(resubscribeSchema, { id })

      const result = await strapi.plugin('stripe-payment').service('subscription').resubscribe(validatedParams)

      if (!result) {
        throw new createHttpError.NotFound(`Subscription with ID ${id} not found`)
      }

      ctx.send(result)
    }
  })
)
