import { BadRequestException, Injectable } from '@nestjs/common'
import { OrganizationService as StripeCustomerService } from '@dbbs/nestjs-module-stripe'
import { NotFoundError } from '@dbbs/common'
import { SendgridService } from '@dbbs/nestjs-module-sendgrid'
import { ConfigService } from '@nestjs/config'

import { OrganizationRepository, UserRepository } from '../repositories/index.js'
import {
  IAcceptInvite,
  IAddUserToOrganization,
  ICreateOrganizationParams,
  IDeleteUser,
  IOrganization,
  IPaginatedResponse,
  IPaginationOptions,
  ISendInviteToOrganization,
  IUpdateOrganizationName,
  IUpdateOrganizationOwner,
  IUpdateOrganizationQuantity
} from '../interfaces/index.js'
import { InviteService } from './invite.service.js'
import { emailToAuthorizedUserTemplate, emailToUnAuthorizedUserTemplate } from '../templates/index.js'
import { InviteStatus } from '../enums/invite.enum.js'

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly stripeCustomerService: StripeCustomerService,
    private readonly userRepository: UserRepository,
    private readonly inviteService: InviteService,
    private readonly configService: ConfigService,
    private readonly sendgridService: SendgridService
  ) {}

  get basePath(): string {
    const basePath = this.configService.get<string>('BASE_URL')

    if (!basePath) {
      throw new Error('Missing base path')
    }

    return basePath
  }

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

  getOrganizationById(id: number): Promise<IOrganization | null> {
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

  async sendInviteToOrganization({
    organizationId,
    recipientEmail,
    organizationName,
    userId
  }: ISendInviteToOrganization): Promise<boolean> {
    // TODO (#1233): Nestjs Stripe-payment: wrap create, update and delete, send email operations with transaction

    if (!userId) {
      await this.sendgridService.sendEmail(emailToUnAuthorizedUserTemplate({ recipientEmail, organizationName }))
      return true
    }

    const invite = await this.inviteService.createInvite({
      organizationId,
      userId,
      email: recipientEmail
    })
    const acceptInviteLink = `${this.basePath}/organizations/${organizationId}/invites/${invite.id}/accept/${userId}`

    await this.sendgridService.sendEmail(
      emailToAuthorizedUserTemplate({ acceptInviteLink, recipientEmail, organizationName })
    )

    return true
  }

  async addUserToOrganization({ organizationId, userId }: IAddUserToOrganization): Promise<boolean> {
    const organization = await this.getOrganizationById(organizationId)
    if (!organization) {
      throw new NotFoundError(`Organization with Id ${organizationId} does not exist`)
    }
    const doesUserExist = await this.userRepository.doesUserExist(userId)

    if (!doesUserExist) {
      throw new NotFoundError(`User with Id ${userId} does not exist`)
    }

    const users = await this.userRepository.getOrganizationUsers(organizationId)

    if (users.some(({ id }) => id === userId)) {
      throw new BadRequestException(`User with Id ${userId} already exists in organization ${organization.name}`)
    }

    if (organization.quantity < users.length + 1) {
      throw new BadRequestException('Cannot add user to organization, increase your organization quantity')
    }

    await this.organizationRepository.addUser({ organizationId, userId })

    return true
  }

  async acceptInvite({ inviteId, userId, organizationId }: IAcceptInvite): Promise<boolean> {
    const invite = await this.inviteService.getInviteById(inviteId)

    switch (invite?.status) {
      case InviteStatus.Pending:
        await this.addUserToOrganization({ organizationId, userId })
        return this.inviteService.acceptInvite({ inviteId })
      case InviteStatus.Accepted:
        throw new BadRequestException(`Invite with Id ${inviteId} already accepted`)
      case InviteStatus.Cancelled:
        throw new BadRequestException(`Invite with Id ${inviteId} already cancelled, create new invite`)
      default:
        throw new NotFoundError(
          `Invite with Id ${inviteId} to organization with Id ${organizationId} for user ${userId} not found`
        )
    }
  }

  async removeUserFromOrganization({ organizationId, userId }: IDeleteUser): Promise<boolean> {
    const organization = await this.getOrganizationById(organizationId)
    if (!organization) {
      throw new NotFoundError(`Organization with Id ${organizationId} does not exist`)
    }

    const isUserExist = await this.userRepository.doesUserExist(userId)
    if (!isUserExist) {
      throw new NotFoundError(`User with Id ${userId} does not exist`)
    }

    const users = await this.userRepository.getOrganizationUsers(organizationId)
    if (!users.some(({ id }) => id === userId)) {
      throw new BadRequestException(`User with id ${userId} is not a member of organization`)
    }

    const removedRows = await this.organizationRepository.removeUserFromOrganization({ organizationId, userId })

    return !!removedRows
  }
}
