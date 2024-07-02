import { type PlopTypes } from '@turbo/gen'

export const generateAndroid = (answers: Parameters<PlopTypes.DynamicActionsFunction>[0]) => {
  if (!answers) return []

  const appName = answers.name
  const appNameInLowerCase = answers.name.toLowerCase()
  const appNameInUpperCase = answers.name.toUpperCase()
  const templateProps = { appNameInLowerCase, appNameInUpperCase, appName }

  return [
    {
      type: 'append',
      path: `{{ turbo.paths.root }}/apps/${appName}/android/settings.gradle`,
      pattern: /includeBuild\('\.\.\/node_modules\/@react-native\/gradle-plugin'\)/,
      separator: '\n',
      template:
        "include ':react-native-vector-icons'\nproject(':react-native-vector-icons').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-vector-icons/android')"
    },
    {
      type: 'append',
      path: `{{ turbo.paths.root }}/apps/${appName}/android/settings.gradle`,
      pattern: /includeBuild\('\.\.\/node_modules\/@react-native\/gradle-plugin'\)/,
      separator: '\n',
      template:
        "include ':react-native-config'\nproject(':react-native-config').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-config/android')"
    },
    {
      type: 'modify',
      path: `{{ turbo.paths.root }}/apps/${appName}/android/settings.gradle`,
      pattern: /\.\.\//gi,
      template: '../../../'
    },
    {
      type: 'append',
      path: `{{ turbo.paths.root }}/apps/${appName}/android/app/src/main/java/com/${appName.toLowerCase()}/MainApplication.kt`,
      pattern: /import com.facebook.soloader.SoLoader/,
      separator: '\n',
      template: 'import com.oblador.vectoricons.VectorIconsPackage'
    },
    {
      type: 'append',
      path: `{{ turbo.paths.root }}/apps/${appName}/android/app/src/main/java/com/${appName.toLowerCase()}/MainApplication.kt`,
      pattern: /import com.oblador.vectoricons.VectorIconsPackage/,
      separator: '\n',
      template: 'import com.lugg.RNCConfig.RNCConfigPackage'
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/android/app/build.gradle`,
      templateFile: 'mobile-app/templates/android/build-gradle.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/android/app/src/main/AndroidManifest.xml`,
      templateFile: 'mobile-app/templates/android/AndroidManifest.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/android/app/src/androidTest/java/com/${appName.toLowerCase()}/DetoxTest.kt`,
      templateFile: 'mobile-app/templates/android/DetoxTest.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/android/app/src/main/res/xml/network_security_config.xml`,
      templateFile: 'mobile-app/templates/android/network_security_config.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/android/build.gradle`,
      templateFile: 'mobile-app/templates/android/root-build-gradle.hbs',
      data: templateProps
    }
  ]
}
