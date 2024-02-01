import { type PlopTypes } from '@turbo/gen'

export const generateIos = (answers: Parameters<PlopTypes.DynamicActionsFunction>[0]) => {
  if (!answers) return []

  const appName = answers.name

  const pathToReactNativeScripts = /\.\.\/node_modules\/react-native\/scripts\//gi

  return [
    {
      type: 'modify',
      path: `{{ turbo.paths.root }}/apps/${appName}/ios/${appName}.xcodeproj/project.pbxproj`,
      pattern: pathToReactNativeScripts,
      template: '../../../node_modules/react-native/scripts/'
    }
  ]
}
