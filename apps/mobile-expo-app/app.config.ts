import { ExpoConfig, ConfigContext } from 'expo/config'
import { withSentry } from '@sentry/react-native/expo'

const IS_DEV = process.env.EXPO_PUBLIC_APP_VARIANT === 'dev'

export default ({ config }: ConfigContext): ExpoConfig => {
  const updatedConfig: ExpoConfig = {
    ...config,
    name: IS_DEV ? 'DBBS Expo (Dev)' : 'DBBS Expo',
    slug: 'mobile-expo-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    extra: {
      storybookEnabled: process.env.STORYBOOK_ENABLED,
      eas: {
        projectId: '9385ca9a-5dc8-4779-95d6-d2d9138da1c0'
      }
    },
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      googleServicesFile: './firebase/GoogleService-Info.plist',
      supportsTablet: true,
      bundleIdentifier: 'com.dbbs.expo'
    },
    android: {
      googleServicesFile: './firebase/google-services.json',
      package: 'com.dbbs.expo',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF'
      }
    },
    web: {
      favicon: './assets/favicon.png'
    }
  }

  return withSentry(updatedConfig, {
    url: 'https://sentry.io/',
    project: process.env.SENTRY_ORG_PROJECT,
    organization: process.env.SENTRY_ORG_NAME
  })
}
