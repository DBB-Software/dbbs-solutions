import { jest } from '@jest/globals'
import { Test, TestingModule } from '@nestjs/testing'
import { WebhookController } from '../../webhook/webhook.controller.js'
import { WebhookService } from '../../webhook/webhook.service.js'
import { StripeWebhookGuard } from '../../webhook/webhook.guard.js'
import {
  defaultCheckoutSessionCompletedStripeEvent,
  defaultInvoicePaymentFailedStripeEvent,
  defaultInvoicePaymentSucceededStripeEvent,
  nonExistingStripeEvent,
  priceCreatedStripeEvent,
  priceDeletedStripeEvent,
  priceUpdatedStripeEvent,
  productCreatedStripeEvent,
  productDeletedStripeEvent,
  productUpdatedStripeEvent
} from '../mocks/index.js'
import { StripeEvent } from '@dbbs/nestjs-module-stripe'

describe('WebhookController', () => {
  let controller: WebhookController
  let webhookService: jest.Mocked<WebhookService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookController],
      providers: [
        {
          provide: WebhookService,
          useValue: {
            handleProductCreated: jest.fn(),
            handleProductUpdated: jest.fn(),
            handleProductDeleted: jest.fn(),
            handlePriceCreated: jest.fn(),
            handlePriceDeleted: jest.fn(),
            handlePriceUpdated: jest.fn(),
            handleCheckoutSessionCompleted: jest.fn(),
            handleInvoicePaymentSucceeded: jest.fn(),
            handleInvoicePaymentFailed: jest.fn()
          }
        }
      ]
    })
      .overrideGuard(StripeWebhookGuard)
      .useValue({
        canActivate: jest.fn((_) => true)
      })
      .compile()

    controller = module.get<WebhookController>(WebhookController)
    webhookService = module.get(WebhookService)
  })

  describe('handleEvent', () => {
    it.each([
      {
        name: 'should handle Stripe product created event',
        controllerMethodArgs: productCreatedStripeEvent,
        serviceMethod: 'handleProductCreated',
        serviceMethodArgs: productCreatedStripeEvent
      },
      {
        name: 'should handle Stripe product updated event',
        controllerMethodArgs: productUpdatedStripeEvent,
        serviceMethod: 'handleProductUpdated',
        serviceMethodArgs: productUpdatedStripeEvent
      },
      {
        name: 'should handle Stripe product deleted event',
        controllerMethodArgs: productDeletedStripeEvent,
        serviceMethod: 'handleProductDeleted',
        serviceMethodArgs: productDeletedStripeEvent
      },
      {
        name: 'should handle Stripe price created event',
        controllerMethodArgs: priceCreatedStripeEvent,
        serviceMethod: 'handlePriceCreated',
        serviceMethodArgs: priceCreatedStripeEvent
      },
      {
        name: 'should handle Stripe price deleted event',
        controllerMethodArgs: priceDeletedStripeEvent,
        serviceMethod: 'handlePriceDeleted',
        serviceMethodArgs: priceDeletedStripeEvent
      },
      {
        name: 'should handle Stripe price updated event',
        controllerMethodArgs: priceUpdatedStripeEvent,
        serviceMethod: 'handlePriceUpdated',
        serviceMethodArgs: priceUpdatedStripeEvent
      },
      {
        name: 'should handle Stripe checkout session completed event',
        controllerMethodArgs: defaultCheckoutSessionCompletedStripeEvent,
        serviceMethod: 'handleCheckoutSessionCompleted',
        serviceMethodArgs: defaultCheckoutSessionCompletedStripeEvent
      },
      {
        name: 'should handle Stripe invoice payment succeeded event',
        controllerMethodArgs: defaultInvoicePaymentSucceededStripeEvent,
        serviceMethod: 'handleInvoicePaymentSucceeded',
        serviceMethodArgs: defaultInvoicePaymentSucceededStripeEvent
      },
      {
        name: 'should handle Stripe invoice payment failed event',
        controllerMethodArgs: defaultInvoicePaymentFailedStripeEvent,
        serviceMethod: 'handleInvoicePaymentFailed',
        serviceMethodArgs: defaultInvoicePaymentFailedStripeEvent
      },
      {
        name: 'should not handle other Stripe events',
        controllerMethodArgs: nonExistingStripeEvent
      }
    ])('$name', async ({ controllerMethodArgs, serviceMethod, serviceMethodArgs }) => {
      await controller.handleEvent(controllerMethodArgs as StripeEvent)

      if (serviceMethod) {
        expect(webhookService[serviceMethod as keyof WebhookService]).toHaveBeenCalledWith(serviceMethodArgs)
      }
    })
  })
})
