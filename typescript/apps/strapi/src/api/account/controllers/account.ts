import { factories } from '@strapi/strapi'
import { CreateAccountParams, UpdateAccountParams } from '../types/account'

export default factories.createCoreController('api::account.account', ({ strapi }) => ({
  async create(ctx) {
    const { userId, provider } = ctx.request.body as CreateAccountParams

    if (!userId || !provider) {
      return ctx.badRequest('Missing required fields')
    }

    try {
      const accountService = strapi.service('api::account.account')
      const account = await accountService.createAccount({ userId, provider })

      return ctx.send({ account })
    } catch (err) {
      if (err.message.includes('exists')) {
        return ctx.conflict(err.message)
      }
      strapi.log.error('Error creating account:', err)
      return ctx.internalServerError('Unable to create account')
    }
  },

  async find(ctx) {
    try {
      const accountService = strapi.service('api::account.account')
      const accounts = await accountService.findAllAccounts()
      return ctx.send({ accounts })
    } catch (err) {
      strapi.log.error('Error fetching accounts:', err)
      return ctx.internalServerError('Unable to fetch accounts')
    }
  },

  async findOne(ctx) {
    const { id } = ctx.params

    try {
      const accountService = strapi.service('api::account.account')
      const account = await accountService.getAccountById(id)
      if (!account) {
        return ctx.notFound('Account not found')
      }
      return ctx.send({ account })
    } catch (err) {
      strapi.log.error('Error fetching account:', err)
      return ctx.internalServerError('Unable to fetch account')
    }
  },

  async update(ctx) {
    const { id } = ctx.params
    const { firstName, lastName } = ctx.request.body as Omit<UpdateAccountParams, 'id'>

    try {
      const accountService = strapi.service('api::account.account')
      const account = await accountService.getAccountById(id)
      if (!account) {
        return ctx.notFound('Account not found')
      }

      const updatedAccount = await accountService.updateAccount({ id, firstName, lastName })
      return ctx.send({ updatedAccount })
    } catch (err) {
      strapi.log.error('Error updating account:', err)
      return ctx.internalServerError('Unable to update account')
    }
  },

  async delete(ctx) {
    const { id } = ctx.params

    try {
      const accountService = strapi.service('api::account.account')
      const account = await accountService.getAccountById(id)
      if (!account) {
        return ctx.notFound('Account not found')
      }

      await accountService.deleteAccount(id)
      return ctx.send({ message: 'Account deleted successfully' })
    } catch (err) {
      strapi.log.error('Error deleting account:', err)
      return ctx.internalServerError('Unable to delete account')
    }
  }
}))
