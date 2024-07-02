import { errors } from '@strapi/utils'

const checkOrganizationOwnerMiddleware = async (ctx, next) => {
  const userId = ctx.state.user.id
  const organizationId = ctx.params.id

  const organization = await strapi.query('plugin::stripe-payment.organization').findOne({
    where: { id: organizationId },
    select: ['owner_id']
  })

  if (!organization) {
    throw new errors.NotFoundError(`Organization with ID ${organizationId} not found`)
  }

  if (organization.owner_id !== userId.toString()) {
    throw new errors.ForbiddenError('User is not the owner of this organization')
  }

  await next()
}

export default checkOrganizationOwnerMiddleware
