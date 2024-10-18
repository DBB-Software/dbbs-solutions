import { SetMetadata } from '@nestjs/common'
import { Condition } from './interfaces/index.js'

/**
 * Interface representing a required rule for an ability.
 * @interface RequiredRule
 */
export interface RequiredRule {
  /**
   * The subject to which the rule applies.
   * @type {string}
   */
  subject: string

  /**
   * The conditions that must be met for the rule to apply.
   * Optional.
   * @type {Condition[]}
   */
  conditions?: Condition[]
}

/**
 * Metadata key for checking abilities.
 * @constant
 * @type {string}
 */
export const CHECK_ABILITY = 'check_ability'

/**
 * Custom decorator for setting required abilities on route handlers.
 * @function
 * @param {RequiredRule} requirement - The required rule.
 * @returns {MethodDecorator} - A method decorator to set metadata.
 */
export const CheckAbilities = (requirement: RequiredRule): MethodDecorator => SetMetadata(CHECK_ABILITY, requirement)
