import { Injectable } from '@nestjs/common'
import { ConditionsMatcher, PureAbility } from '@casl/ability'
import { StrapiRolesService } from './strapi-roles.service.js'
import { AppAbility, ConditionQuery } from './types/index.js'
import { initializeAbilities, conditionToQuery } from './helpers/initialize-abilities.js'
import { SinglePermission, Condition } from './interfaces/index.js'
import { CASL_CONDITIONS, DEFAULT_ACTION } from './constants/index.js'
import { customConditionsMatcher } from './helpers/conditions-matcher.js'

/**
 * Factory for creating and managing abilities based on Strapi permissions.
 * @class AbilityFactory
 */
@Injectable()
export class AbilityFactory {
  private permissionsAbilities: { [key: string]: AppAbility } = {}

  /**
   * Constructs a new instance of the AbilityFactory.
   * @constructor
   * @param {StrapiRolesService} strapiRolesService - Service for fetching and managing Strapi roles and permissions.
   */
  constructor(private strapiRolesService: StrapiRolesService) {}

  /**
   * Initializes permissions and abilities.
   * Fetches permissions from Strapi and creates abilities.
   * @async
   * @returns {Promise<void>}
   */
  async initializePermissions() {
    const permissions = await this.strapiRolesService.getPermissions()

    this.permissionsAbilities = initializeAbilities({ permissions, conditions: CASL_CONDITIONS })
  }

  /**
   * Retrieves abilities for a specific user and subject.
   * @async
   * @param {string} userId - The ID of the user.
   * @param {string} subject - The subject for which to get abilities.
   * @param {Condition[]} [conditions] - The list of conditions.
   * @returns {Promise<AppAbility | false>} - The user's abilities for the subject or false if no abilities found.
   */
  async getAbilitiesForUser(userId: string, subject: string, conditions?: Condition[]): Promise<AppAbility | false> {
    const userPermissions = await this.strapiRolesService.getPermissionsByUserId(userId)

    if (!this.findEnabledPermission(userPermissions, subject)) {
      return false
    }

    if (!this.permissionsAbilities[subject]) {
      this.createAbilityForSubject(subject, conditions)
    }

    return this.permissionsAbilities[subject]
  }

  /**
   * Find enabled permissions for a given subject.
   * @param {SinglePermission[]} permissions - The list of permissions.
   * @param {string} subject - The subject to filter permissions for.
   * @returns {boolean}
   */
  findEnabledPermission(permissions: SinglePermission[], subject: string): boolean {
    return permissions.some((permission) => permission.action === subject)
  }

  /**
   * Creates an ability for a given subject.
   * @param {string} subject - The subject for which to create an ability.
   * @param {Condition[]} [conditions] - The list of conditions.
   */
  private createAbilityForSubject(subject: string, conditions?: Condition[]) {
    const queryConditions = conditions ? conditionToQuery(conditions) : {}
    const ability = new PureAbility(
      [
        {
          action: DEFAULT_ACTION,
          subject,
          conditions: queryConditions
        }
      ],
      {
        conditionsMatcher: customConditionsMatcher as ConditionsMatcher<ConditionQuery>
      }
    )

    this.permissionsAbilities[subject] = ability as AppAbility
  }
}
