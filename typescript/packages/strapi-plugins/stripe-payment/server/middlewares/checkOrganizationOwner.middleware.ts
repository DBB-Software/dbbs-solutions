import createHttpError from 'http-errors'

const checkOrganizationOwnerMiddleware = async (ctx, next) => {
  const userId = ctx.state.user.id
  const organizationId = ctx.params.id

  const organization = await strapi.query('plugin::stripe-payment.organization').findOne({
    where: { id: organizationId },
    select: ['owner_id']
  })

  if (!organization) {
    throw new createHttpError.NotFound(`Organization with ID ${organizationId} not found`)
  }

  if (organization.owner_id !== userId.toString()) {
    throw new createHttpError.Forbidden('User is not the owner of this organization')
  }

  await next()
}

export default checkOrganizationOwnerMiddleware
