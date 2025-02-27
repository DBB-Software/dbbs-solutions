import createHttpError from 'http-errors'

const checkSubscriptionOwnerMiddleware = async (ctx, next) => {
  const userId = ctx.state.user.id
  const subscriptionId = ctx.params.id

  const subscription = await strapi.query('plugin::stripe-payment.subscription').findOne({
    where: { id: subscriptionId },
    populate: ['organization']
  })

  if (!subscription) {
    throw new createHttpError.NotFound(`Subscription with ID ${subscriptionId} not found`)
  }

  if (subscription.organization.owner_id !== userId.toString()) {
    throw new createHttpError.Forbidden('User is not the owner of the organization related to this subscription')
  }

  await next()
}

export default checkSubscriptionOwnerMiddleware
