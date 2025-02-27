import { ValidationError } from '@dbbs/common'

import { SendEmailInput, SendEmailInputRequired } from '../types/index.js'
import { RegexPattern } from './regex.pattern.js'

/**
 * Validates a single email address format using a regular expression.
 * Throws a ValidationError if the email address is invalid.
 *
 * @param {string} email - The email address to be validated.
 * @throws {ValidationError} If the email format is invalid.
 * @returns {void}
 */
export const validateEmail = (email: string): void => {
  if (!RegexPattern.email.test(email)) {
    throw new ValidationError(`Invalid email format: ${email}`)
  }
}

/**
 * Validates the input data for sending an email.
 * This function checks that all required fields are present, validates the format of email addresses,
 * and ensures that at least one of the body fields (`text` or `html`) is provided.
 *
 * @param {SendEmailInput} input - The email data to be validated, including subject, recipient(s), and content.
 * @throws {ValidationError} If any required field is missing or any email address has an invalid format.
 * @returns {void}
 *
 * @throws {ValidationError} When:
 * - `subject` is missing.
 * - Neither `text` nor `html` is provided.
 * - Any email address in `to`, `cc`, or `bcc` has an invalid format.
 */
export function validateSendEmailPayload(input: SendEmailInput): asserts input is SendEmailInputRequired {
  if (!input.subject) {
    throw new ValidationError('Missing required fields: subject')
  }

  if (!input.text && !input.html) {
    throw new ValidationError('Missing required fields: text or html must be provided')
  }

  if (Array.isArray(input.to)) {
    input.to.forEach(validateEmail)
  } else {
    validateEmail(input.to)
  }

  if (input.cc) {
    if (Array.isArray(input.cc)) {
      input.cc.forEach(validateEmail)
    } else {
      validateEmail(input.cc)
    }
  }

  if (input.bcc) {
    if (Array.isArray(input.bcc)) {
      input.bcc.forEach(validateEmail)
    } else {
      validateEmail(input.bcc)
    }
  }
}
