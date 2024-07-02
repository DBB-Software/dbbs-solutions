import { LoggerModule } from '@dbbs/nestjs-module-logger'
import { afterAll, beforeEach, describe, expect, it } from '@jest/globals'
import { INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import supertest from 'supertest'
import { CqrsModule } from '@nestjs/cqrs'
import { EventStoreModule } from '../event-store-module/event-store.module.js'
import { Knex, KnexModule } from 'nestjs-knex'
import { UserController } from './user.controller.js'
import { UserRepository } from './user.repository.js'
import { UserMainRepository } from './projections/user-main.repository.js'
import { commandHandlers, userEventHandlers, queryHandlers } from './user.module.js'
import knex from 'knex'

describe('UserController (e2e)', () => {
  const context = {
    user: { id: '' }
  }

  let db: Knex
  let app: INestApplication

  beforeAll(() => {
    db = knex({
      client: 'sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: './test.db'
      }
    })
  })

  afterAll(async () => {
    await db.schema.dropTable('users')
    await db.destroy()
  })

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        LoggerModule.forRoot({}),
        CqrsModule,
        EventStoreModule,
        KnexModule.forRootAsync({
          useFactory: () => ({
            config: {
              client: 'sqlite3',
              useNullAsDefault: true,
              connection: {
                filename: './test.db'
              }
            }
          })
        })
      ],
      controllers: [UserController],
      providers: [...commandHandlers, ...queryHandlers, ...userEventHandlers, UserRepository, UserMainRepository]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Users /create-user (POST)', (done) => {
    expect(process.env.NODE_ENV).toBe('test')

    supertest(app.getHttpServer())
      .post('/users/create-user')
      .send({ name: 'John Doe' })
      .expect(200)
      .then((response) => {
        expect(response.text).toEqual('Acknowledgement OK')
        done()
      })
      .catch((err) => done(err))
  })

  it('Users /main (GET)', (done) => {
    expect(process.env.NODE_ENV).toBe('test')

    supertest(app.getHttpServer())
      .get('/users/main')
      .expect(200)
      .then((response) => {
        expect(response.body.length).toEqual(1)
        context.user = response.body[0]
        done()
      })
      .catch((err) => done(err))
  })

  it('Users /main/:id (GET)', (done) => {
    expect(process.env.NODE_ENV).toBe('test')

    supertest(app.getHttpServer())
      .get(`/users/main/${context.user.id}`)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toEqual(context.user.id)
        done()
      })
      .catch((err) => done(err))
  })
})
