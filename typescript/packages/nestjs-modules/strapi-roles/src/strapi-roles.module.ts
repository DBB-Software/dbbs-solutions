import { Module, OnModuleInit } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { StrapiRolesService } from './strapi-roles.service.js'
import { AbilityFactory } from './ability.factory.js'
import { AbilityGuard } from './ability.guard.js'

/**
 * Module that provides Strapi roles functionality.
 * Handles initialization and configuration of Strapi roles, permissions, and related services.
 * @module StrapiRolesModule
 */
@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  providers: [StrapiRolesService, AbilityFactory, AbilityGuard],
  exports: [StrapiRolesService, AbilityFactory, AbilityGuard]
})
export class StrapiRolesModule implements OnModuleInit {
  /**
   * Constructs a new instance of the StrapiRolesModule.
   * @constructor
   * @param {AbilityFactory} abilityFactory - Factory for creating and managing user abilities based on permissions.
   */
  constructor(private abilityFactory: AbilityFactory) {}

  /**
   * Lifecycle hook that is called once the module has been initialized.
   * Initializes permissions by invoking the ability factory.
   * @async
   * @returns {Promise<void>}
   */
  async onModuleInit() {
    await this.abilityFactory.initializePermissions()
  }
}
