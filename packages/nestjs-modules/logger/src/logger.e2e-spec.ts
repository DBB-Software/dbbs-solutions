import { afterAll, afterEach, beforeEach, describe, expect, it } from '@jest/globals'
import { Controller, Get, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import captureConsole from 'capture-console'
import supertest from 'supertest'
import { InjectLogger } from './injectLogger.js'
import { Logger } from './logger.js'
import { LoggerModule } from './logger.module.js'

describe('Test Logger Response (e2e)', () => {
  let app: INestApplication
  let logResponse: any

  @Controller('/')
  class TestController {
    constructor(
      @InjectLogger() private readonly logger: Logger
    ) {}

    @Get()
    get() {
      this.logger.info('TEST')
    }
  }

  beforeEach(async () => {
    captureConsole.startCapture(process.stdout, (log) => logResponse = log)

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      controllers: [TestController],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterEach(() => {
   captureConsole.stopCapture(process.stdout)
  })

  afterAll(async () => {
    await app.close()
  })

  it('Test logger.info response / (GET)', (done) => {
    supertest(app.getHttpServer())
      .get('/')
      .expect(200)
      .then(() => {
        const parsedLog = JSON.parse(logResponse)
        expect(parsedLog.awsRequestId).toBeDefined()
        expect(parsedLog.apiRequestId).toBeDefined()
        expect(parsedLog['x-correlation-id']).toBeDefined()
        done()
      })
      .catch((err) => done(err))
  })
})
