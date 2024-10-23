import knex from 'knex'
import { ProductRepository } from '../../repositories/product.repository.js'
import {
  dbPlansList,
  dbProductsList,
  productEntityWithTwoPlans,
  defaultProductEntity,
  productEntityWithZeroPlans,
  productEntityWithOnePlan,
  createdProduct
} from '../mocks/index.js'
import { createProductsTable, createPlansTable } from '../factories/database.js'

describe('ProductRepository', () => {
  let productRepository: ProductRepository
  let db: knex.Knex

  const baseId = Date.now()
  const getId = (id: number) => id + baseId

  beforeAll(async () => {
    db = knex({
      client: 'sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: './test_data.db'
      }
    })

    productRepository = new ProductRepository(db)

    await createProductsTable(db, dbProductsList(baseId))
    await createPlansTable(db, dbPlansList(baseId))
  })

  describe('Get products', () => {
    const testCases = [
      {
        description: 'should return all products with their associated plans',
        expectedLength: 10
      },
      {
        description: 'should return paginated products with custom skip and limit',
        paginationOptions: { skip: 5, limit: 2 },
        expectedLength: 2
      },
      {
        description: 'should return paginated products with custom skip',
        paginationOptions: { skip: 3 },
        expectedLength: 10
      },
      {
        description: 'should return paginated products with custom limit',
        paginationOptions: { limit: 3 },
        expectedLength: 3
      }
    ]
    test.each(testCases)('$description', async ({ paginationOptions, expectedLength }) => {
      const result = await productRepository.getProducts(paginationOptions)

      expect(result.products.length).toEqual(expectedLength)
    })
  })

  describe('Get product by ID', () => {
    const testCases = [
      {
        description: 'should return the correct product by ID',
        repositoryMethodArgs: { id: getId(1), populatePlans: false },
        expected: defaultProductEntity(baseId)
      },
      {
        description: 'should return null if product does not exist',
        repositoryMethodArgs: { id: getId(999), populatePlans: false },
        expected: null
      }
    ]

    it.each(testCases)('$description', async ({ repositoryMethodArgs, expected }) => {
      const { id, populatePlans } = repositoryMethodArgs

      const result = await productRepository.getProductById(id, populatePlans)

      expect(result).toEqual(expected)
    })
  })

  describe('Get product with plans by ID', () => {
    const testCases = [
      {
        description: 'should return product with 0 plans by ID',
        repositoryMethodArgs: { id: getId(3), populatePlans: true },
        expected: productEntityWithZeroPlans(baseId)
      },
      {
        description: 'should return product with 1 plan by ID',
        repositoryMethodArgs: { id: getId(2), populatePlans: true },
        expected: productEntityWithOnePlan(baseId)
      },
      {
        description: 'should return product with 2 plans by ID',
        repositoryMethodArgs: { id: getId(1), populatePlans: true },
        expected: productEntityWithTwoPlans(baseId)
      },
      {
        description: 'should return null if product does not exist',
        repositoryMethodArgs: { id: getId(999), populatePlans: true },
        expected: null
      }
    ]

    it.each(testCases)('$description', async ({ repositoryMethodArgs, expected }) => {
      const { id, populatePlans } = repositoryMethodArgs
      const result = await productRepository.getProductById(id, populatePlans)

      if (result) {
        result.plans!.sort((plan1, plan2) => plan1.id - plan2.id)
      }

      expect(result).toEqual(expected)
    })
  })

  describe('Get product by Stripe ID', () => {
    const testCases = [
      {
        description: 'should return product by Stripe ID',
        stripeId: `prod_${getId(1)}`,
        expected: defaultProductEntity(baseId)
      },
      {
        description: 'should return null if product with this Stripe ID does not exist',
        stripeId: 'non_existent_stripe_id',
        expected: null,
      }
    ]

    it.each(testCases)('$description', async ({ stripeId, expected }) => {
      const result = await productRepository.getProductByStripeId(stripeId)

      expect(result).toEqual(expected)
    })
  })

  describe('Check if product exists by Stripe ID', () => {
    const testCases = [
      {
        description: 'should return true if product exists by Stripe ID',
        stripeId: `prod_${getId(1)}`,
        expected: true,
      },
      {
        description: 'should return false if product does not exist by Stripe ID',
        stripeId: 'non_existent_stripe_id',
        expected: false,
      }
    ]

    it.each(testCases)('$description', async ({ stripeId, expected }) => {
      const result = await productRepository.productExistsByStripeId(stripeId)

      expect(result).toEqual(expected)
    })
  })

  describe('Create product', () => {
    const testCases = [
      {
        description: 'should create a new product and return it',
        repositoryMethodArgs: { name: `Product ${getId(16)}`, stripeId: `prod_${getId(16)}` },
        expected: createdProduct(baseId)
      }
    ]

    it.each(testCases)('$description', async ({ repositoryMethodArgs, expected }) => {
      const result = await productRepository.createProduct(repositoryMethodArgs)

      expect(result).toEqual(expected)

      const productInDb = await db('products').select('id').where({ id: result.id }).first()
      expect(productInDb.id).toEqual(result.id)
    })
  })

  describe('Update product', () => {
    const testCases = [
      {
        description: 'should update an existing product and return it',
        repositoryMethodArgs: { id: getId(1), name: 'Updated Product 1' },
        expected: { ...defaultProductEntity(baseId), name: 'Updated Product 1' },
      },
      {
        description: 'should return null if product does not exist',
        repositoryMethodArgs: { id: getId(999), name: 'Non-Existent Product' },
        expected: null,
      },
    ]

    it.each(testCases)('$description', async ({ repositoryMethodArgs, expected }) => {
      const { id, name } = repositoryMethodArgs
      const result = await productRepository.updateProduct({ id, name })

      expect(result).toEqual(expected)

      if (expected) {
        const productInDb = await db('products').select('id').where({ id }).first()
        expect(productInDb.id).toEqual(result?.id)
      }
    })
  })

  describe('Delete product', () => {
    const testCases = [
      {
        description: 'should delete the product and return the number of deleted rows',
        id: getId(1),
        expected: 1,
      },
      {
        description: 'should return 0 if product does not exist',
        id: getId(999),
        expected: 0,
      },
    ]

    it.each(testCases)('$description', async ({ id, expected }) => {
      const result = await productRepository.deleteProduct(id)

      expect(result).toBe(expected)

      if (expected) {
        const productInDb = await db('products').where({ id }).first()
        expect(productInDb).toBeUndefined()
      }
    })
  })
})
