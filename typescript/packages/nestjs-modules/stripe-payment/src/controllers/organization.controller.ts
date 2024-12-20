import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { InjectLogger, Logger } from '@dbbs/nestjs-module-logger'
import { NotFoundError } from '@dbbs/common'

import {
  CreateOrganizationDto,
  OrganizationDto,
  PaginatedResponseDto,
  PaginationOptionsDto,
  PurchaseDto,
  TransactionDto,
  UpdateOrganizationNameDto,
  UpdateOrganizationOwnerDto,
  UpdateOrganizationQuantityDto
} from '../dtos/index.js'
import { OrganizationService } from '../services/organization.service.js'
import { PurchaseService } from '../services/purchase.service.js'
import { TransactionService } from '../services/transaction.service.js'

@Controller('organizations')
export class OrganizationController {
  constructor(
    @InjectLogger(OrganizationController.name) private readonly logger: Logger,
    private readonly organizationService: OrganizationService,
    private readonly purchaseService: PurchaseService,
    private readonly transactionService: TransactionService
  ) {}

  @Post()
  async create(@Body() createOrganizationDto: CreateOrganizationDto): Promise<OrganizationDto> {
    try {
      return await this.organizationService.createOrganization(createOrganizationDto)
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }

  @Get(':id')
  async getOrganizationById(@Param('id', ParseIntPipe) id: number): Promise<OrganizationDto> {
    try {
      const organization = await this.organizationService.getOrganizationById(id)

      if (!organization) {
        throw new NotFoundError(`Organization with ID ${id} was not found`)
      }

      return organization
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }

  @Get()
  async getAll(@Query() queryParams: PaginationOptionsDto): Promise<PaginatedResponseDto<OrganizationDto>> {
    const { page, perPage } = queryParams

    try {
      return await this.organizationService.getAll({ page, perPage })
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }

  @Get(':id/purchases')
  async getOrganizationPurchases(
    @Param('id', ParseIntPipe) organizationId: number,
    @Query() queryParams: PaginationOptionsDto
  ): Promise<PaginatedResponseDto<PurchaseDto>> {
    const { page, perPage } = queryParams

    try {
      return await this.purchaseService.getOrganizationPurchases(organizationId, { page, perPage })
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }

  @Get(':id/transactions')
  async getOrganizationTransactions(
    @Param('id', ParseIntPipe) organizationId: number,
    @Query() queryParams: PaginationOptionsDto
  ): Promise<PaginatedResponseDto<TransactionDto>> {
    const { page, perPage } = queryParams

    try {
      return await this.transactionService.getOrganizationTransactions(organizationId, { page, perPage })
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }

  @Patch(':id/name')
  async updateOrganizationName(
    @Param('id', ParseIntPipe) id: number,
    @Body() { name }: UpdateOrganizationNameDto
  ): Promise<OrganizationDto> {
    try {
      return await this.organizationService.updateOrganizationName({ id, name })
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }

  @Patch(':id/quantity')
  async updateOrganizationQuantity(
    @Param('id', ParseIntPipe) id: number,
    @Body() { quantity }: UpdateOrganizationQuantityDto
  ): Promise<OrganizationDto> {
    try {
      return await this.organizationService.updateOrganizationQuantity({ id, quantity })
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }

  @Delete(':id')
  async deleteOrganization(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    try {
      return await this.organizationService.deleteOrganization(id)
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }

  @Patch(':id/owner')
  async updateOrganizationOwner(
    @Param('id', ParseIntPipe) id: number,
    @Body() { ownerId }: UpdateOrganizationOwnerDto
  ): Promise<OrganizationDto> {
    try {
      return await this.organizationService.updateOrganizationOwner({ id, ownerId })
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }
}
