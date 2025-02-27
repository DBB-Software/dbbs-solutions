/**
 * Type representing the data required to send an email.
 * This interface defines the structure of the input data needed by the `SendgridService` to send an email.
 * It includes the email subject, content, and recipient information.
 *
 * @type {SendEmailInput}
 */
export type SendEmailInput = {
  /**
   * The subject of the email.
   * Specifies the subject line of the email.
   *
   * @type {string}
   */
  subject: string

  /**
   * The HTML message content of the email.
   * Specifies the email's body content in HTML format.
   *
   * This field is optional. If not provided, the email will use `text` content if available.
   *
   * @type {string | undefined}
   */
  html?: string

  /**
   * The plain text content of the email.
   * Specifies the email's body content in plain text format.
   *
   * This field is optional. If not provided, the email will use `html` content if available.
   *
   * @type {string | undefined}
   */
  text?: string

  /**
   * The recipient's email address.
   * Specifies the destination email(s) of the email.
   *
   * Can be a single email address or an array of email addresses.
   *
   * @type {string | string[]}
   */
  to: string | string[]

  /**
   * Email address(es) that should receive a copy of the email.
   *
   * Can be a single email address or an array of email addresses.
   *
   * @type {string | string[] | undefined}
   */
  cc?: string | string[]

  /**
   * Email address(es) that should receive a blind carbon copy (BCC) of the email.
   *
   * Can be a single email address or an array of email addresses.
   *
   * @type {string | string[] | undefined}
   */
  bcc?: string | string[]
}

/**
 * Type representing the required data for sending an email.
 * This type is a refined version of `SendEmailInput`, where at least one of the fields `text` or `html` is required.
 *
 * The `text` or `html` fields are mutually exclusive and at least one must be provided for the email to be valid.
 *
 * @type {SendEmailInputRequired}
 */
export type SendEmailInputRequired = SendEmailInput & ({ text: string } | { html: string })
