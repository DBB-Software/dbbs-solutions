import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ForbiddenError } from '@casl/ability'
import { AbilityFactory } from './ability.factory.js'
import { CHECK_ABILITY, RequiredRule } from './ability.decorator.js'
import { Condition, User } from './interfaces/index.js'
import { AppAbility, ConditionField, ConditionQuery } from './types/index.js'
import { DEFAULT_ACTION } from './constants/index.js'

/**
 * Guard to handle abilities and permissions using CASL.
 * Checks if the user has the necessary permissions to perform an action on a subject.
 * @class AbilitiesGuard
 * @implements {CanActivate}
 */
@Injectable()
export class AbilityGuard implements CanActivate {
  /**
   * Constructs a new instance of the AbilitiesGuard.
   * @constructor
   * @param {Reflector} reflector - Used to access metadata about the route handler.
   * @param {AbilityFactory} abilityFactory - Factory for creating and managing user abilities.
   */
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory
  ) {}

  /**
   * Determines if the current request can proceed based on user's abilities.
   * @async
   * @param {ExecutionContext} context - The current execution context.
   * @returns {Promise<boolean>} - True if the user has the required abilities, false otherwise.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirement = this.reflector.get<RequiredRule>(CHECK_ABILITY, context.getHandler())

    if (!requirement) {
      return true
    }

    const { subject, conditions } = requirement
    const { user } = context.switchToHttp().getRequest() as { user: User }

    if (!user) {
      return false
    }

    const ability = await this.abilityFactory.getAbilitiesForUser(user.id, subject, conditions)

    if (!ability) {
      return false
    }

    if (conditions) {
      const dynamicCondition = this.applyDynamicConditions(ability, user, conditions)
      ability.update([{ action: DEFAULT_ACTION, subject, conditions: dynamicCondition }])
    }

    ForbiddenError.from(ability).throwUnlessCan('access', subject)

    if (conditions) {
      const { query } = context.switchToHttp().getRequest()
      Object.assign(query, this.applyConditions(user, conditions))
    }

    return true
  }

  /**
   * Applies dynamic conditions based on the user.
   * @param {AppAbility} ability - The ability object.
   * @param {User} user - The user object.
   * @param {Condition[]} conditions - The list of conditions.
   * @returns {ConditionQuery} - The dynamic conditions query.
   */
  private applyDynamicConditions(ability: AppAbility, user: User, conditions: Condition[]): ConditionQuery {
    const dynamicConditions: ConditionQuery = {}

    conditions.forEach((condition) => {
      let { value } = condition
      if (typeof value === 'string' && value.includes('user.')) {
        value = user[value.split('user.')[1] as keyof User] as ConditionField
      }
      dynamicConditions[condition.field] = {
        [`$${condition.operator}`]: value
      }
    })

    return dynamicConditions
  }

  /**
   * Applies conditions to the query based on the user.
   * @param {User} user - The user object.
   * @param {Condition[]} [conditions] - The list of conditions.
   * @returns {ConditionQuery} - The query object.
   */
  private applyConditions(user: User, conditions: Condition[]): ConditionQuery {
    return conditions.reduce((query, condition) => {
      let { value } = condition
      if (typeof value === 'string' && value.includes('user.')) {
        value = user[value.split('user.')[1] as keyof User] as ConditionField
      }
      return {
        ...query,
        [condition.field]: {
          [`$${condition.operator}`]: value
        }
      }
    }, {} as ConditionQuery)
  }
}
