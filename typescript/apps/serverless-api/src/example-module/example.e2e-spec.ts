import { AuthzModule } from '@dbbs/nestjs-module-authz'
import { LoggerModule } from '@dbbs/nestjs-module-logger'
import { afterAll, beforeEach, describe, expect, it } from '@jest/globals'
import { INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthGuard } from '@nestjs/passport'
import { Test, TestingModule } from '@nestjs/testing'
import supertest from 'supertest'
import { ExampleModule } from './example.module.js'

describe('ExampleController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, LoggerModule.forRoot({}), ExampleModule, AuthzModule]
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: () => true
      })
      .compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Example /:id (GET)', (done) => {
    expect(process.env.NODE_ENV).toBe('test')

    supertest(app.getHttpServer())
      .get('/examples/testID')
      .expect(200)
      .then((response) => {
        expect(response.body.example.id).toEqual('testID')

        done()
      })
      .catch((err) => done(err))
  })
})
