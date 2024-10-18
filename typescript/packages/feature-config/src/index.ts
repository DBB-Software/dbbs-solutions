import constants from './constants'

/**
 * Enum for feature flag keys.
 * These keys are used to manage feature toggles across the application.
 */
enum FeatureFlags {
  API_LOG_TRANSPORTS = 'API_LOG_TRANSPORTS'
}

/**
 * Service to check if a feature flag is enabled.
 * Utilizes a simple lookup to determine the state of feature flags.
 */
class FeatureFlagService {
  /**
   * Determines if the specified feature flag is enabled.
   * @param {FeatureFlags} featureFlag - The feature flag to check.
   * @returns {boolean} Returns `true` if the feature flag is enabled, otherwise `false`.
   */
  public isEnabled(featureFlag: FeatureFlags): boolean {
    return constants[featureFlag]
  }
}

export { FeatureFlags, FeatureFlagService }
