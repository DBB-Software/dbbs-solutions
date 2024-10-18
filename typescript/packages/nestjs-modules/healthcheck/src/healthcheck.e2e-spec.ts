import { describe, beforeEach, jest, afterAll, it, expect } from '@jest/globals'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import supertest from 'supertest'
import { HealthcheckModule } from './healthcheck.module.js'

jest.useFakeTimers()

const correctSettingsContent = {
  TENANTS: { 'dbbs-uk': { NAME: 'dbbs-uk', DB_HOST: 'localhost', OPENSEARCH_HOST: 'localhost' } }
}

function initTenantSettings() {
  const settings = { tenantsMappings: {} }
  settings.tenantsMappings = correctSettingsContent
  return settings
}

describe('HealthcheckController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [initTenantSettings]
        }),
        HealthcheckModule
      ]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Healthcheck /health-check (GET)', (done) => {
    expect(process.env.NODE_ENV).toBe('test')

    supertest(app.getHttpServer())
      .get('/health-check')
      .expect(200)
      .then((response) => {
        expect(response.body.version).toBeDefined()

        done()
      })
      .catch((err) => done(err))
  })
})
