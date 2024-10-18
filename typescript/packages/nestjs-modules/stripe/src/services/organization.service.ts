import { Inject, Injectable } from '@nestjs/common'
import Stripe from 'stripe'
import { STRIPE_SDK } from '../constants.js'
import { ICreateOrganizationParams, IDeleteOrganizationParams, IUpdateOrganizationParams } from '../interfaces/index.js'

@Injectable()
export class OrganizationService {
  constructor(@Inject(STRIPE_SDK) private readonly stripe: Stripe) {}

  async create(params: ICreateOrganizationParams) {
    const { name, email } = params

    return this.stripe.customers.create({
      name,
      email
    })
  }

  async update(params: IUpdateOrganizationParams) {
    const { id, name } = params

    return this.stripe.customers.update(id, {
      name
    })
  }

  async delete(params: IDeleteOrganizationParams) {
    const { id } = params

    return this.stripe.customers.del(id)
  }
}
