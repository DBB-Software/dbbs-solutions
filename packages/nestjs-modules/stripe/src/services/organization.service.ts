import { Inject, Injectable } from '@nestjs/common'
import Stripe from 'stripe'
import createHttpError from 'http-errors'
import { STRIPE_SDK } from '../constants.js'
import {
  ICreateOrganizationParams,
  IDeleteOrganizationParams,
  IUpdateOrganizationParams
} from '../interfaces/organization.js'

@Injectable()
export class OrganizationService {
  constructor(@Inject(STRIPE_SDK) private readonly stripe: Stripe) {}

  async create(params: ICreateOrganizationParams) {
    const { name, email } = params

    try {
      return await this.stripe.customers.create({
        name,
        email
      })
    } catch {
      throw new createHttpError.BadRequest('Failed to create an organization')
    }
  }

  async update(params: IUpdateOrganizationParams) {
    const { id, name } = params

    try {
      return await this.stripe.customers.update(id, {
        name
      })
    } catch {
      throw new createHttpError.BadRequest('Failed to update an organization')
    }
  }

  async delete(params: IDeleteOrganizationParams) {
    const { id } = params

    try {
      return await this.stripe.customers.del(id)
    } catch {
      throw new createHttpError.BadRequest('Failed to delete an organization')
    }
  }
}
