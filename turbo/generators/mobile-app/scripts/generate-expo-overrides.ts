import { type PlopTypes } from '@turbo/gen'

export const generateExpoOverrides = (answers: Parameters<PlopTypes.DynamicActionsFunction>[0]) => {
  if (!answers) return []

  const appName = answers.name
  const { storybook, storage, appType } = answers
  const appNameInLowerCase = answers.name.toLowerCase()
  const templateProps = { appNameInLowerCase, appName, storybook, storage, appType }

  const actions = [
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/android/app/src/androidTest/java/com/${appName.toLowerCase()}/DetoxTest.kt`,
      templateFile: 'mobile-app/templates/android/DetoxTest.hbs',
      data: templateProps
    },
    {
      type: 'modify',
      path: `{{ turbo.paths.root }}/apps/${appName}/android/app/build.gradle`,
      pattern: /(compileSdk rootProject.ext.compileSdkVersion)/g,
      template: '$1\n    flavorDimensions "default"'
    },
    {
      type: 'modify',
      path: `{{ turbo.paths.root }}/apps/${appName}/android/app/build.gradle`,
      pattern:
        /(signingConfigs \{\n {8}debug \{\n {12}storeFile file\('debug.keystore'\)\n {12}storePassword 'android'\n {12}keyAlias 'androiddebugkey'\n {12}keyPassword 'android'\n {8}\}\n {4}\})/g,
      template: `$1\n    productFlavors {\n        prod {\n            resValue "string", "app_name", "${appName}"\n        }\n        dev {\n            resValue "string", "app_name", "${appName}"\n        }\n    }`
    }
  ]

  return actions
}
