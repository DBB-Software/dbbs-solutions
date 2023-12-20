import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { IExampleResponse } from '../types/example.js'
import { ExampleService } from './example.service.js'

@UseGuards(AuthGuard('jwt'))
@Controller('/examples')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get('/:id')
  async get(@Param('id') id: string): Promise<IExampleResponse> {
    const example = this.exampleService.getExample(id)

    return { example }
  }
}
