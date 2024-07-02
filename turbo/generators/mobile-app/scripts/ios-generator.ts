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
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/ios/${appName}/Info.plist`,
      templateFile: 'mobile-app/templates/ios/Info-plist.hbs',
      data: { appName }
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/ios/${appName}/${appName}.entitlements`,
      templateFile: 'mobile-app/templates/ios/Entitlements.hbs'
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/ios/${appName}.xcodeproj/xcshareddata/xcschemes/${appName} Prod.xcscheme`,
      templateFile: 'mobile-app/templates/ios/MobileApp Prod.xcscheme.hbs',
      data: { appName }
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/ios/${appName}.xcodeproj/xcshareddata/xcschemes/${appName} Dev.xcscheme`,
      templateFile: 'mobile-app/templates/ios/MobileApp Dev.xcscheme.hbs',
      data: { appName }
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/ios/${appName}/AppDelegate.mm`,
      templateFile: 'mobile-app/templates/ios/AppDelegate.hbs',
      data: { appName }
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/ios/Podfile`,
      templateFile: 'mobile-app/templates/ios/Podfile.hbs',
      data: { appName }
    }
  ]
}
