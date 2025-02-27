import { ClientResponse } from '@sendgrid/client/src/response.js'

import { SendEmailInput } from '../../types/index.js'

export const MOCK_EMAIL = 'sender@gmail.com'

export const MOCK_SEND_EMAIL_PAYLOAD: SendEmailInput = {
  to: 'recipient@gmail.com',
  html: '<h1>Test Message</h1>',
  text: 'Test Text',
  subject: 'Test Subject'
}

export const MOCK_SEND_RESPONSE: [ClientResponse, object] = [
  {
    statusCode: 200,
    body: {},
    headers: 'headers'
  },
  {}
]
