import { type PlopTypes } from '@turbo/gen'

export const generateAndroid = (answers: Parameters<PlopTypes.DynamicActionsFunction>[0]) => {
  if (!answers) return []

  const appName = answers.name

  const regexPathToRNCommands = /react {/gi
  const regexPathToNativeModulesGradle =
    /\.\.\/\.\.\/node_modules\/@react-native-community\/cli-platform-android\/native_modules\.gradle/gi

  return [
    {
      type: 'append',
      path: `{{ turbo.paths.root }}/apps/${appName}/android/app/build.gradle`,
      pattern: regexPathToRNCommands,
      separator: '\n    ',
      template: 'reactNativeDir = file("../../../../node_modules/react-native")'
    },
    {
      type: 'append',
      path: `{{ turbo.paths.root }}/apps/${appName}/android/app/build.gradle`,
      pattern: regexPathToRNCommands,
      separator: '\n    ',
      template: 'hermesCommand = "../../../../node_modules/react-native/sdks/hermesc/%OS-BIN%/hermesc"'
    },
    {
      type: 'modify',
      path: `{{ turbo.paths.root }}/apps/${appName}/android/app/build.gradle`,
      pattern: regexPathToNativeModulesGradle,
      template: '../../../../node_modules/@react-native-community/cli-platform-android/native_modules.gradle'
    }
  ]
}
