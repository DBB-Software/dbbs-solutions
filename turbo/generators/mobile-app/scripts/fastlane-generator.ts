import { type PlopTypes } from '@turbo/gen'

export const generateFastlane = (answers: Parameters<PlopTypes.DynamicActionsFunction>[0]) => {
  if (!answers) return []

  const appName = answers.name
  const appNameUpperCase = answers.name.toUpperCase()
  const templateProps = { appNameUpperCase, appName }

  return [
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/fastlane/Fastfile`,
      templateFile: 'mobile-app/templates/fastlane/Fastfile.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/fastlane/Appfile`,
      templateFile: 'mobile-app/templates/fastlane/Appfile.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/fastlane/Matchfile`,
      templateFile: 'mobile-app/templates/fastlane/Matchfile.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/fastlane/Pluginfile`,
      templateFile: 'mobile-app/templates/fastlane/Pluginfile.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/fastlane/metadata/ios/primary_category.txt`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/fastlane/metadata/ios/secondary_category.txt`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/fastlane/metadata/ios/default/description.txt`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/fastlane/metadata/ios/default/keywords.txt`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/fastlane/metadata/ios/default/marketing_url.txt`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/fastlane/metadata/ios/default/name.txt`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/fastlane/metadata/ios/default/privacy_url.txt`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/fastlane/metadata/ios/default/promotional_text.txt`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/fastlane/metadata/ios/default/subtitle.txt`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/fastlane/metadata/ios/default/support_url.txt`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/fastlane/metadata/ios/default/changelogs/default.txt`
    }
  ]
}
