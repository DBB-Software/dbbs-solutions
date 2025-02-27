import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { InviteRepository, UserRepository, OrganizationRepository } from '../repositories/index.js'
import { ICreateInvite, IInvite, IAcceptInvite, ICancelInvite } from '../interfaces/invite.interface.js'
import { InviteStatus } from '../enums/invite.enum.js'

@Injectable()
export class InviteService {
  constructor(
    private readonly inviteRepository: InviteRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly userRepository: UserRepository
  ) {}

  async createInvite(payload: ICreateInvite): Promise<IInvite> {
    const userExists = await this.userRepository.doesUserExist(payload.userId)
    if (!userExists) {
      throw new BadRequestException(`User with ID ${payload.userId} does not exist`)
    }

    const organizationExists = await this.organizationRepository.organizationExists(payload.organizationId)

    if (!organizationExists) {
      throw new BadRequestException(`Organization with ID ${payload.organizationId} does not exist`)
    }

    return this.inviteRepository.createInvite({ ...payload, status: InviteStatus.Pending })
  }

  async acceptInvite({ inviteId }: IAcceptInvite): Promise<boolean> {
    const result = await this.inviteRepository.updateInviteStatus({ inviteId, status: InviteStatus.Accepted })

    if (!result) {
      throw new NotFoundException(`Invite with ID ${inviteId} does not exist`)
    }

    return true
  }

  async cancelInvite({ inviteId }: ICancelInvite): Promise<boolean> {
    const result = await this.inviteRepository.updateInviteStatus({ inviteId, status: InviteStatus.Cancelled })

    if (!result) {
      throw new NotFoundException(`Invite with ID ${inviteId} does not exist`)
    }

    return true
  }

  getInviteById(id: number): Promise<IInvite | null> {
    return this.inviteRepository.getInviteById(id)
  }
}
