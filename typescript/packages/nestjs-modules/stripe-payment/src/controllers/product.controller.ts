import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { InjectLogger, Logger } from '@dbbs/nestjs-module-logger'
import { NotFoundError } from '@dbbs/common'
import { ProductService } from '../services/product.service.js'
import {
  CreateProductDto,
  PaginatedResponseDto,
  PaginationOptionsDto,
  ProductDto,
  UpdateProductDto
} from '../dtos/index.js'

@Controller('products')
export class ProductController {
  constructor(
    @InjectLogger(ProductController.name) private readonly logger: Logger,
    private readonly productService: ProductService
  ) {}

  @Get()
  async getProducts(@Query() queryParams: PaginationOptionsDto): Promise<PaginatedResponseDto<ProductDto>> {
    const { page = 1, perPage = 10 } = queryParams

    try {
      return await this.productService.getProducts({ page, perPage })
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }

  @Post()
  async createProduct(@Body() body: CreateProductDto): Promise<ProductDto> {
    const { name } = body
    try {
      return await this.productService.createProduct({ name })
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }

  @Get(':id')
  async getProductById(@Param('id', ParseIntPipe) id: number): Promise<ProductDto> {
    try {
      const product = await this.productService.getProductById(id)

      if (!product) {
        throw new NotFoundError(`Product with ID ${id} was not found`)
      }

      return product
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }

  @Patch(':id')
  async updateProduct(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateProductDto): Promise<ProductDto> {
    const { name } = body

    try {
      return await this.productService.updateProduct({ id, name })
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<{ id: number }> {
    try {
      await this.productService.deleteProduct({ id })

      return { id }
    } catch (error) {
      this.logger.error((error as Error).message)
      throw error
    }
  }
}
