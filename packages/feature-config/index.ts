import constants from './constants'

enum FeatureFlags {
   API_LOG_TRANSPORTS = "API_LOG_TRANSPORTS"
}

class FeatureFlagService {

   public isEnabled(featureFlag: FeatureFlags): boolean {
      return constants[featureFlag]
   }
}
 
export { FeatureFlags, FeatureFlagService }