import { Injectable } from '@nestjs/common'
import { NotFoundError } from '@dbbs/common'
import { OrganizationRepository } from '../repositories/organization.repository.js'
import { IPaginatedResponse, IPaginationOptions, IPurchase } from '../interfaces/index.js'
import { PurchaseRepository } from '../repositories/purchase.repository.js'

@Injectable()
export class PurchaseService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly purchaseRepository: PurchaseRepository
  ) {}

  async getOrganizationPurchases(
    organizationId: number,
    paginationOptions: IPaginationOptions = { page: 1, perPage: 10 }
  ): Promise<IPaginatedResponse<IPurchase>> {
    const { page = 1, perPage = 10 } = paginationOptions

    const organizationExists = await this.organizationRepository.organizationExists(organizationId)
    if (!organizationExists) {
      throw new NotFoundError(`Cannot get purchases for a non-existing organization with ID ${organizationId}`)
    }

    const { purchases, total } = await this.purchaseRepository.getOrganizationPurchases(organizationId, {
      skip: (page - 1) * perPage,
      limit: perPage
    })

    return {
      items: purchases,
      total,
      page,
      perPage
    }
  }
}
