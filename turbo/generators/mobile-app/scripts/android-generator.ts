import { type PlopTypes } from '@turbo/gen'

export const generateAndroid = (answers: Parameters<PlopTypes.DynamicActionsFunction>[0]) => {
  if (!answers) return []

  const appName = answers.name
  const { iap } = answers
  const appNameInLowerCase = answers.name.toLowerCase()
  const appNameInUpperCase = answers.name.toUpperCase()
  const templateProps = { appNameInLowerCase, appNameInUpperCase, appName, iap }

  return [
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/android/settings.gradle`,
      templateFile: 'mobile-app/templates/react-native-cli/android/settings.gradle.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/android/app/src/main/java/com/${appNameInLowerCase}/MainApplication.kt`,
      templateFile: 'mobile-app/templates/react-native-cli/android/MainApplication.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/android/app/src/main/java/com/${appNameInLowerCase}/MainActivity.kt`,
      templateFile: 'mobile-app/templates/react-native-cli/android/MainActivity.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/android/app/build.gradle`,
      templateFile: 'mobile-app/templates/react-native-cli/android/build-gradle.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/android/app/signing.gradle`,
      templateFile: 'mobile-app/templates/react-native-cli/android/signing.gradle.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/android/app/src/main/AndroidManifest.xml`,
      templateFile: 'mobile-app/templates/react-native-cli/android/AndroidManifest.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/android/app/src/androidTest/java/com/${appName.toLowerCase()}/DetoxTest.kt`,
      templateFile: 'mobile-app/templates/react-native-cli/android/DetoxTest.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/android/app/src/main/res/xml/network_security_config.xml`,
      templateFile: 'mobile-app/templates/react-native-cli/android/network_security_config.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/android/build.gradle`,
      templateFile: 'mobile-app/templates/react-native-cli/android/root-build-gradle.hbs',
      data: templateProps
    }
  ]
}
