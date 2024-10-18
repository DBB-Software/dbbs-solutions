import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common'
import { InjectLogger, Logger } from '@dbbs/nestjs-module-logger'
import { NotFoundError } from '@dbbs/common'
import { CreatePlanDto, PlanDto } from '../dtos/index.js'
import { PlanService } from '../services/plan.service.js'
import { PlanType } from '../enums/index.js'

@Controller('plans')
export class PlanController {
  constructor(
    @InjectLogger(PlanController.name) private readonly logger: Logger,
    private readonly planService: PlanService
  ) {}

  @Get(':id')
  async getPlanById(@Param('id', ParseIntPipe) id: number): Promise<PlanDto> {
    try {
      const plan = await this.planService.getPlanById(id)

      if (!plan) {
        throw new NotFoundError(`Plan with ID ${id} was not found`)
      }

      return plan
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }

  @Post()
  async createPlan(@Body() body: CreatePlanDto): Promise<PlanDto> {
    const { type, currency, productId, price, interval } = body

    const planData = {
      type,
      currency,
      productId,
      price,
      ...(type === PlanType.RECURRING && interval && { interval })
    }

    try {
      return await this.planService.createPlan(planData)
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }

  @Delete(':id')
  async deletePlan(@Param('id', ParseIntPipe) id: number): Promise<{ id: number }> {
    try {
      await this.planService.deletePlan({ id })

      return { id }
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }
}
