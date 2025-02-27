import { CheckoutSessionMetadataService } from '../../services/index.js'
import { defaultCheckoutSessionMetadata, invalidCheckoutSessionMetadata } from '../mocks/index.js'

describe('CheckoutSessionMetadataService', () => {
  let service: CheckoutSessionMetadataService

  beforeAll(() => {
    service = new CheckoutSessionMetadataService()
  })

  describe(CheckoutSessionMetadataService.prototype.validateMetadata.name, () => {
    it('should not throw an error for valid metadata', () => {
      expect(() => service.validateMetadata(defaultCheckoutSessionMetadata)).not.toThrow()
    })

    it.each([
      { field: 'id', value: 0, error: 'id must be a positive number' },
      { field: 'id', value: -1, error: 'id must be a positive number' },
      { field: 'checkoutSessionStripeId', value: '', error: 'checkoutSessionStripeId must be a non-empty string' },
      { field: 'checkoutSessionStripeId', value: null, error: 'checkoutSessionStripeId must be a non-empty string' },
      { field: 'organizationId', value: 0, error: 'organizationId must be a positive number' },
      { field: 'planId', value: -5, error: 'planId must be a positive number' },
      { field: 'quantity', value: 0, error: 'quantity must be a positive number' },
    ])(
      'should throw an error if $field is invalid',
      ({ field, value, error }) => {
        const metadata: any= {
          ...defaultCheckoutSessionMetadata
        }

        metadata[field] = value

        expect(() => service.validateMetadata(metadata)).toThrow(error)
      }
    )

    it('should throw an error with multiple invalid fields', () => {

      expect(() => service.validateMetadata(invalidCheckoutSessionMetadata)).toThrow(
        'Invalid metadata: id must be a positive number, checkoutSessionStripeId must be a non-empty string, organizationId must be a positive number, planId must be a positive number, quantity must be a positive number'
      )
    })
  })
})
