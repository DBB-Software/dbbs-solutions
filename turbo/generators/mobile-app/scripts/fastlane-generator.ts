import { type PlopTypes } from '@turbo/gen'

export const generateFastlane = (answers: Parameters<PlopTypes.DynamicActionsFunction>[0]) => {
  if (!answers) return []

  const appName = answers.name
  const appNameUpperCase = answers.name.toUpperCase()
  const templateProps = { appNameUpperCase, appName }

  return [
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/fastlane/Fastfile`,
      templateFile: 'mobile-app/templates/shared/fastlane/Fastfile.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/fastlane/Appfile`,
      templateFile: 'mobile-app/templates/shared/fastlane/Appfile.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/fastlane/Matchfile`,
      templateFile: 'mobile-app/templates/shared/fastlane/Matchfile.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/fastlane/Pluginfile`,
      templateFile: 'mobile-app/templates/shared/fastlane/Pluginfile.hbs',
      data: templateProps
    }
  ]
}
