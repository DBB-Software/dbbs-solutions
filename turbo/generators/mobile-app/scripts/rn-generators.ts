import { type PlopTypes } from '@turbo/gen'

export const generateRN = (answers: Parameters<PlopTypes.DynamicActionsFunction>[0]) => {
  if (!answers) return []

  const appName = answers.name
  const appNameInLowerCase = answers.name.toLowerCase()
  const templateProps = { appNameInLowerCase, appName }

  return [
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/.eslintrc.json`,
      templateFile: 'mobile-app/templates/eslint-config.hbs'
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/app.json`,
      templateFile: 'mobile-app/templates/app-json.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/babel.config.cjs`,
      templateFile: 'mobile-app/templates/babel-config.hbs'
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/Gemfile`,
      templateFile: 'mobile-app/templates/Gemfile.hbs'
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/index.js`,
      templateFile: 'mobile-app/templates/index.hbs'
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/jest.config.ts`,
      templateFile: 'mobile-app/templates/jest-config.hbs'
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/metro.config.cjs`,
      templateFile: 'mobile-app/templates/metro-config.hbs'
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/package.json`,
      templateFile: 'mobile-app/templates/package-json.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/tsconfig.app.json`,
      templateFile: 'mobile-app/templates/tsconfig-app-json.hbs'
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/tsconfig.json`,
      templateFile: 'mobile-app/templates/tsconfig-json.hbs'
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/tsconfig.spec.json`,
      templateFile: 'mobile-app/templates/tsconfig-spec-json.hbs'
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/src/app/index.tsx`,
      templateFile: 'mobile-app/templates/src/app/index.hbs'
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/src/app/navigators/app-navigator.tsx`,
      templateFile: 'mobile-app/templates/src/app/navigators/app-navigator.hbs'
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/src/screens/home.screen.tsx`,
      templateFile: 'mobile-app/templates/src/screens/home.screen.hbs'
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/__tests__/app/App.test.tsx`,
      templateFile: 'mobile-app/templates/__tests__/app/App.test.hbs'
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/__tests__/screens/home.spec.tsx`,
      templateFile: 'mobile-app/templates/__tests__/screens/home.spec.hbs'
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/__tests__/testUtils/setupTests.ts`,
      templateFile: 'mobile-app/templates/__tests__/testUtils/setupTests.hbs'
    }
  ]
}
