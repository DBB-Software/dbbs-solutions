import { Controller, Get, Body, Param, ParseIntPipe, Patch, Query, Delete } from '@nestjs/common'
import { InjectLogger, Logger } from '@dbbs/nestjs-module-logger'
import { NotFoundError } from '@dbbs/common'
import { SubscriptionService } from '../services/subscription.service.js'
import {
  PaginatedResponseDto,
  PaginationOptionsDto,
  SubscriptionDto,
  UpdateSubscriptionQuantityDto
} from '../dtos/index.js'

@Controller('subscriptions')
export class SubscriptionController {
  constructor(
    @InjectLogger(SubscriptionController.name) private readonly logger: Logger,
    private readonly subscriptionService: SubscriptionService
  ) {}

  @Get()
  async getSubscriptions(@Query() queryParams: PaginationOptionsDto): Promise<PaginatedResponseDto<SubscriptionDto>> {
    const { page = 1, perPage = 10 } = queryParams

    try {
      return await this.subscriptionService.getSubscriptions({ page, perPage })
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }

  @Get(':id')
  async getSubscriptionById(@Param('id') id: number) {
    try {
      const subscription = await this.subscriptionService.getSubscriptionById(id)

      if (!subscription) {
        throw new NotFoundError(`Subscription with ID ${id} was not found`)
      }

      return subscription
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }

  @Patch(':id/cancel')
  async cancelSubscription(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.subscriptionService.cancelSubscription(id)
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }

  @Patch(':id/pause')
  async pauseSubscription(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.subscriptionService.pauseSubscription(id)
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }

  @Patch('/:id/resume')
  async resumeSubscription(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.subscriptionService.resumeSubscription(id)
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }

  @Patch(':id/quantity')
  async updateSubscriptionQuantity(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubscriptionQuantityDto: UpdateSubscriptionQuantityDto
  ) {
    try {
      return await this.subscriptionService.updateSubscriptionQuantity(id, updateSubscriptionQuantityDto.quantity)
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }

  @Patch(':id/resubscribe')
  async resubscribe(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.subscriptionService.resubscribe(id)
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }

  // FIXME: use ID of an authenticated user's subscription instead
  @Delete(':id')
  async deleteSubscription(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.subscriptionService.deleteSubscription(id)
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }
}
