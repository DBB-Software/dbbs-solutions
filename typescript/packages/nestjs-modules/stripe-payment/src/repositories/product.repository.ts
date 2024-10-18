import knex from 'knex'
import { Injectable } from '@nestjs/common'
import { InjectConnection } from 'nest-knexjs'
import { ProductEntity } from '../entites/index.js'
import { CreateProductPayload, PaginationOptions, ProductDbRecord, UpdateProductPayload } from '../types/index.js'
import { PlanRepository } from './plan.repository.js'

@Injectable()
export class ProductRepository {
  constructor(@InjectConnection() private readonly knexConnection: knex.Knex) {}

  static toJSON(productRecord: ProductDbRecord): ProductEntity {
    const productEntity: ProductEntity = {
      id: productRecord.id,
      name: productRecord.name,
      stripeId: productRecord.stripeId,
      createdAt: new Date(productRecord.createdAt),
      updatedAt: new Date(productRecord.updatedAt)
    }

    if (productRecord.plans) {
      productEntity.plans = productRecord.plans.map((plan) => PlanRepository.toJSON(plan))
    }

    return productEntity
  }

  private getProductBaseQuery(populatePlans: boolean = true) {
    let query = this.knexConnection('products').select('products.*')

    if (populatePlans) {
      query = query
        .leftJoin('plans', 'plans.productId', '=', 'products.id')
        .select(
          this.knexConnection.raw(
            ` 
            case when \`plans\`.\`id\` is not null
            then
              json_group_array(
                json_object(
                  'id', \`plans\`.\`id\`,
                  'interval', \`plans\`.\`interval\`,
                  'stripeId', \`plans\`.\`stripeId\`,
                  'type', \`plans\`.\`type\`,
                  'price', \`plans\`.\`price\`,
                  'productId', \`plans\`.\`productId\`,
                  'createdAt', \`plans\`.\`createdAt\`,
                  'updatedAt', \`plans\`.\`updatedAt\`
                )
              )
            else
              json_array()
            end as plans
          `
          )
        )
        .groupBy('products.id')
    }

    return query
  }

  async getProducts(
    paginationOptions: PaginationOptions = { skip: 0, limit: 10 }
  ): Promise<{ products: ProductEntity[]; total: number }> {
    const { skip = 0, limit = 10 } = paginationOptions

    const productsQuery = this.getProductBaseQuery().orderBy('products.id', 'asc').offset(skip).limit(limit)
    const products = await productsQuery

    // TODO (#1329): Nestjs Stripe-payment Product Repository: use a single base query for getProducts method
    const totalQueryResult = await this.knexConnection('products').count('id as total').first()
    const total = Number(totalQueryResult?.total) || 0

    return {
      products: products.map((product) => ProductRepository.toJSON({ ...product, plans: JSON.parse(product.plans) })),
      total
    }
  }

  async getProductById(id: number, populatePlans: boolean = false): Promise<ProductEntity | null> {
    const query = this.getProductBaseQuery(populatePlans).where('products.id', id)

    const product = await query.first()
    if (!product) return null

    return product.plans
      ? ProductRepository.toJSON({ ...product, plans: JSON.parse(product.plans) })
      : ProductRepository.toJSON(product)
  }

  async createProduct({ name, stripeId }: CreateProductPayload): Promise<ProductEntity> {
    const [product] = await this.knexConnection('products')
      .insert({
        name,
        stripeId
      })
      .returning('*')

    return ProductRepository.toJSON(product)
  }

  async getProductByStripeId(stripeId: string): Promise<ProductEntity | null> {
    const product = await this.knexConnection('products').select('*').where('stripeId', stripeId).first()

    return product ? ProductRepository.toJSON(product) : null
  }

  async productExistsByStripeId(stripeId: string): Promise<boolean> {
    const result = await this.knexConnection('products')
      .where('stripeId', stripeId)
      .count({ count: '*' })
      .first<{ count: number | string }>()

    return Boolean(result.count)
  }

  async updateProduct({ id, name }: UpdateProductPayload): Promise<ProductEntity | null> {
    const [updatedProduct] = await this.knexConnection('products').update({ name }).where({ id }).returning('*')

    return updatedProduct ? ProductRepository.toJSON(updatedProduct) : null
  }

  async deleteProduct(id: number): Promise<number> {
    return this.knexConnection('products').delete().where({ id })
  }
}
