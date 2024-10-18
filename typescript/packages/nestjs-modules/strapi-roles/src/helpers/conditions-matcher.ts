import { ConditionsMatcher } from '@casl/ability'
import { ConditionQuery } from '../types/index.js'

/**
 * Custom conditions matcher.
 * @param {ConditionQuery} conditions - The conditions to match.
 * @returns {boolean} - Whether the conditions match.
 */
const customConditionsMatcher: ConditionsMatcher<ConditionQuery> =
  (conditions: ConditionQuery) => (object: Record<string, unknown>) =>
    Object.entries(conditions).every(([field, condition]) =>
      Object.entries(condition).every(([operator, value]) => {
        switch (operator) {
          case '$eq':
            return object[field] === value
          case '$in':
            return Array.isArray(value) && (value as Array<unknown>).includes(object[field])
          default:
            return false
        }
      })
    )

export { customConditionsMatcher }
