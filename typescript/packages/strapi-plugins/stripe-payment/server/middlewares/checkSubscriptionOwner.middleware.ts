import { Strapi } from '@strapi/strapi'
import { errors } from '@strapi/utils'

const checkSubscriptionOwnerMiddleware = async (ctx, next) => {
  const userId = ctx.state.user.id
  const subscriptionId = ctx.params.id

  const subscription = await strapi.query('plugin::stripe-payment.subscription').findOne({
    where: { id: subscriptionId },
    populate: ['organization']
  })

  if (!subscription) {
    throw new errors.NotFoundError(`Subscription with ID ${subscriptionId} not found`)
  }

  if (subscription.organization.owner_id !== userId.toString()) {
    throw new errors.ForbiddenError('User is not the owner of the organization related to this subscription')
  }

  await next()
}

export default checkSubscriptionOwnerMiddleware
