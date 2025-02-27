/**
 * Regular expressions used for validating different types of data.
 * Currently, includes a pattern for email validation.
 *
 * @const
 * @type {Record<string, RegExp>}
 */
export const RegexPattern: Record<PatternName, RegExp> = {
  /**
   * Regular expression for validating email addresses.
   * This pattern is based on the email validation regex provided by
   * [OWASP](https://owasp.org/www-community/OWASP_Validation_Regex_Repository)
   *
   * It checks the email format based on standard rules:
   * - Allows Latin letters, digits, and special characters (_+&*-), as well as a domain consisting of Latin letters.
   * - For example, "test@example.com" or "user.name+tag@sub.domain.com" will be considered valid.
   *
   * @type {RegExp}
   */
  email: /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/
} as const

type PatternName = 'email'
