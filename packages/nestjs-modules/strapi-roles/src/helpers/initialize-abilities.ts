import { PureAbility, ConditionsMatcher } from '@casl/ability'
import { AppAbility, ConditionQuery } from '../types/index.js'
import { DEFAULT_ACTION } from '../constants/index.js'
import { Condition, AbilityOptions } from '../interfaces/index.js'
import { customConditionsMatcher } from './conditions-matcher.js'

/**
 * Converts an array of conditions to a query object.
 * @function
 * @param {Condition[]} conditions - The list of conditions.
 * @returns {ConditionQuery} - The query object.
 */
export function conditionToQuery(conditions: Condition[]): ConditionQuery {
  return conditions.reduce(
    (query, condition) => ({
      ...query,
      [condition.field]: {
        [`$${condition.operator}`]: condition.value
      }
    }),
    {} as ConditionQuery
  )
}

/**
 * Initializes abilities based on provided permissions.
 * @function
 * @param {AbilityOptions} options - The options for initializing abilities.
 * @param {string[]} options.permissions - The list of permissions.
 * @param {Condition[]} [options.conditions] - The list of conditions.
 * @returns {{ [key: string]: AppAbility }} - The mapping of abilities by permission keys.
 */
export function initializeAbilities({ permissions, conditions }: AbilityOptions): { [key: string]: AppAbility } {
  return permissions.reduce(
    (abilities, permission) => {
      const queryConditions = conditions ? conditionToQuery(conditions) : {}
      const ability = new PureAbility(
        [
          {
            action: DEFAULT_ACTION,
            subject: permission,
            conditions: queryConditions
          }
        ],
        {
          conditionsMatcher: customConditionsMatcher as ConditionsMatcher<ConditionQuery>
        }
      )

      return {
        ...abilities,
        [permission]: ability as AppAbility
      }
    },
    {} as { [key: string]: AppAbility }
  )
}
