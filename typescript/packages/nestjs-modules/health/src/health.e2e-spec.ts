import { describe, beforeEach, afterAll, it, expect } from '@jest/globals'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import supertest from 'supertest'
import { HealthModule } from './health.module.js'

describe('HealthController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Health /health (GET)', (done) => {
    expect(process.env.NODE_ENV).toBe('test')

    supertest(app.getHttpServer())
      .get('/health')
      .then((response) => {
        expect(response.body.details.storage).toBeDefined()
        expect(response.body.details.memoryHeap).toBeDefined()

        done()
      })
      .catch((err) => done(err))
  })
})
