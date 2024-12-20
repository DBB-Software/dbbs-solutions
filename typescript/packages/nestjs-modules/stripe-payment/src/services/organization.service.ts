import { BadRequestException, Injectable } from '@nestjs/common'
import { OrganizationService as StripeCustomerService } from '@dbbs/nestjs-module-stripe'
import { NotFoundError } from '@dbbs/common'

import { OrganizationRepository } from '../repositories/organization.repository.js'
import {
  ICreateOrganizationParams,
  IOrganization,
  IPaginatedResponse,
  IPaginationOptions,
  IUpdateOrganizationName,
  IUpdateOrganizationOwner,
  IUpdateOrganizationQuantity
} from '../interfaces/index.js'
import { UserRepository } from '../repositories/user.repository.js'

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly stripeCustomerService: StripeCustomerService,
    private readonly userRepository: UserRepository
  ) {}

  async createOrganization(params: ICreateOrganizationParams): Promise<IOrganization> {
    const { name, email, ownerId, quantity } = params

    if (!(await this.userRepository.doesUserExist(ownerId))) {
      throw new BadRequestException(`User with ID ${ownerId} does not exist`)
    }

    // Todo: Transaction issue #1233
    const customer = await this.stripeCustomerService.create({
      name,
      email
    })
    return this.organizationRepository.createOrganization({
      name,
      stripeCustomerId: customer.id,
      ownerId,
      quantity
    })
  }

  async getOrganizationById(id: number): Promise<IOrganization | null> {
    return this.organizationRepository.getOrganizationById(id)
  }

  async getAll(
    paginationOptions: IPaginationOptions = { page: 1, perPage: 10 }
  ): Promise<IPaginatedResponse<IOrganization>> {
    const { page = 1, perPage = 10 } = paginationOptions

    const { organizations, total } = await this.organizationRepository.getAll({
      skip: (page - 1) * perPage,
      limit: perPage
    })
    return {
      items: organizations,
      total,
      page,
      perPage
    }
  }

  async updateOrganizationName({ id, name }: IUpdateOrganizationName): Promise<IOrganization> {
    const organization = await this.getOrganizationById(id)

    // TODO (#1395): Create NestJS package with custom errors
    if (!organization) {
      throw new NotFoundError(`Cannot update name for non-existing organization with ID ${id}`)
    }

    // TODO (#1233): Nestjs Stripe-payment: wrap create, update and delete operations with transaction
    await this.stripeCustomerService.update({ id: organization.stripeCustomerId, name })

    const updatedOrganization = await this.organizationRepository.updateOrganization({ id, name })

    if (!updatedOrganization) {
      throw new Error(`Failed to update an organization with ID ${id}: the database update was unsuccessful`)
    }

    return updatedOrganization
  }

  async updateOrganizationQuantity({ id, quantity }: IUpdateOrganizationQuantity): Promise<IOrganization> {
    const organization = await this.getOrganizationById(id)

    // TODO (#1395): Create NestJS package with custom errors
    if (!organization) {
      throw new NotFoundError(`Cannot update quantity for non-existing organization with ID ${id}`)
    }

    const updatedOrganization = await this.organizationRepository.updateOrganization({
      id,
      quantity
    })

    if (!updatedOrganization) {
      throw new Error(`Failed to update an organization with ID ${id}: the database update was unsuccessful`)
    }

    return updatedOrganization
  }

  async deleteOrganization(id: number): Promise<boolean> {
    const organization = await this.organizationRepository.getOrganizationById(id, false)

    // TODO (#1395): Create NestJS package with custom errors
    if (!organization) {
      return true
    }

    // TODO (#1233): Nestjs Stripe-payment: wrap create, update and delete operations with transaction
    await this.stripeCustomerService.delete({ id: organization.stripeCustomerId })
    await this.organizationRepository.deleteOrganization(id)

    return true
  }

  async getUserOrganizations(userId: number): Promise<IOrganization[]> {
    const isUserExist = await this.userRepository.doesUserExist(userId)

    if (!isUserExist) {
      throw new NotFoundError(`User with ID ${userId} does not exist`)
    }

    return this.organizationRepository.getUserOrganizations(userId)
  }

  async updateOrganizationOwner({ id, ownerId }: IUpdateOrganizationOwner): Promise<IOrganization> {
    const userExists = await this.userRepository.doesUserExist(ownerId)

    if (!userExists) {
      throw new NotFoundError(`User with ID ${ownerId} does not exist`)
    }

    const organization = await this.getOrganizationById(id)
    if (!organization) {
      throw new NotFoundError(`Cannot update owner for non-existing organization with ID ${id}`)
    }

    const updatedOrganization = await this.organizationRepository.updateOrganization({ id, ownerId })

    if (!updatedOrganization) {
      throw new Error(`Failed to update an organization with ID ${id}: the database update was unsuccessful`)
    }

    return updatedOrganization
  }
}
