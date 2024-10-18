import { factories } from '@strapi/strapi'
import { CreateAccountParams, UpdateAccountParams } from '../types/account'

export default factories.createCoreService('api::account.account', ({ strapi }) => ({
  async createAccount(params: CreateAccountParams) {
    const { userId } = params

    const existingAccount = await strapi.query('api::account.account').findOne({ where: { userId } })
    if (existingAccount) {
      throw new Error('Account with this user_id already exists')
    }

    return strapi.query('api::account.account').create({ data: params })
  },

  async getAccountById(id: string) {
    return strapi.query('api::account.account').findOne({ where: { id } })
  },

  async updateAccount(params: UpdateAccountParams) {
    const { id, ...data } = params

    return strapi.query('api::account.account').update({
      where: { id },
      data
    })
  },

  async deleteAccount(id: string) {
    return strapi.query('api::account.account').delete({ where: { id } })
  },

  async findAllAccounts() {
    return strapi.query('api::account.account').findMany()
  }
}))
