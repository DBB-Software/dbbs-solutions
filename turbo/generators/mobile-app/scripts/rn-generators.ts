import { type PlopTypes } from '@turbo/gen'
import { AppTypes } from '../config'

export const generateRN = (answers: Parameters<PlopTypes.DynamicActionsFunction>[0]) => {
  if (!answers) return []

  const appName = answers.name
  const { storybook, storage, appType, iap } = answers
  const isExpo = appType === AppTypes.EXPO
  const isReactNative = appType === AppTypes.REACT_NATIVE_CLI
  const appNameInLowerCase = answers.name.toLowerCase()
  const templateProps = { appNameInLowerCase, appName, storybook, storage, isExpo, isReactNative, iap }

  const sharedPath = 'mobile-app/templates/shared/'
  const rnCliPath = 'mobile-app/templates/react-native-cli/'
  const expoPath = 'mobile-app/templates/expo/'

  const actions = [
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/.eslintrc.json`,
      templateFile: `${sharedPath}eslint-config.hbs`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/Gemfile`,
      templateFile: `${sharedPath}Gemfile.hbs`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/jest.config.ts`,
      templateFile: `${sharedPath}jest-config.hbs`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/package.json`,
      templateFile: `${sharedPath}package-json.hbs`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/tsconfig.app.json`,
      templateFile: `${sharedPath}tsconfig-app-json.hbs`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/tsconfig.json`,
      templateFile: `${sharedPath}tsconfig-json.hbs`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/tsconfig.spec.json`,
      templateFile: `${sharedPath}tsconfig-spec-json.hbs`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/src/app/index.tsx`,
      templateFile: `${sharedPath}src/app/index.hbs`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/src/app/navigators/app-navigator.tsx`,
      templateFile: `${sharedPath}src/app/navigators/app-navigator.hbs`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/src/app/remote/remote-config-values.tsx`,
      templateFile: `${sharedPath}src/app/remote/remote-config-values.hbs`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/src/screens/home.screen.tsx`,
      templateFile: `${sharedPath}src/screens/home.screen.hbs`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/__tests__/app/App.test.tsx`,
      templateFile: `${sharedPath}__tests__/app/App.test.hbs`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/__tests__/screens/home.spec.tsx`,
      templateFile: `${sharedPath}__tests__/screens/home.spec.hbs`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/__tests__/__mocks__/react-native-branch.ts`,
      templateFile: `${sharedPath}__tests__/__mocks__/react-native-branch.hbs`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/.detoxrc.cjs`,
      templateFile: `${sharedPath}detoxrc.hbs`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/detox.config.ts`,
      templateFile: `${sharedPath}detox.config.hbs`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/e2e/tsconfig.json`,
      templateFile: `${sharedPath}e2e/tsconfig-json.hbs`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/e2e/testUtils/setupTests.ts`,
      templateFile: `${sharedPath}e2e/testUtils/setupTests.hbs`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/e2e/start-up/starter.e2e.ts`,
      templateFile: `${sharedPath}e2e/start-up/starter.e2e.hbs`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/src/sentry/index.ts`,
      templateFile: `${sharedPath}src/sentry/index.hbs`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/src/sentry/init.ts`,
      templateFile: `${sharedPath}src/sentry/init.hbs`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/src/app/locale/en.json`,
      templateFile: `${sharedPath}src/app/locale/en.hbs`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/src/app/locale/de.json`,
      templateFile: `${sharedPath}src/app/locale/de.hbs`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/src/app/locale/index.ts`,
      templateFile: `${sharedPath}src/app/locale/index.hbs`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/credentials-example.json`,
      templateFile: `${sharedPath}credentials-example.hbs`
    }
  ]

  if (isReactNative) {
    actions.push(
      ...([
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/app.json`,
          templateFile: `${rnCliPath}app-json.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/firebase.json`,
          templateFile: `${rnCliPath}firebase-json.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/babel.config.cjs`,
          templateFile: `${rnCliPath}babel-config.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/index.js`,
          templateFile: `${rnCliPath}index.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/__tests__/testUtils/setupTests.ts`,
          templateFile: `${rnCliPath}__tests__/testUtils/setupTests.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/__tests__/__mocks__/react-native-config.ts`,
          templateFile: `${rnCliPath}__tests__/__mocks__/react-native-config.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/__tests__/__mocks__/react-native-localize.ts`,
          templateFile: `${rnCliPath}__tests__/__mocks__/react-native-localize.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/.env.example`,
          templateFile: `${rnCliPath}env.example.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/metro.config.cjs`,
          templateFile: `${rnCliPath}metro.config.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/README.md`,
          templateFile: `${rnCliPath}README.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/scripts/prebuild.sh`,
          templateFile: `${rnCliPath}prebuild.hbs`
        }
      ] satisfies PlopTypes.ActionType[])
    )
  }

  if (isExpo) {
    actions.push(
      ...([
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/__tests__/testUtils/setupTests.ts`,
          templateFile: `${expoPath}__tests__/testUtils/setupTests.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/app.json`,
          templateFile: `${expoPath}app.json.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/app.config.ts`,
          templateFile: `${expoPath}app.config.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/babel.config.js`,
          templateFile: `${expoPath}babel.config.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/eas.json`,
          templateFile: `${expoPath}eas.json.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/.env.production`,
          templateFile: `${expoPath}env-production.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/.env.development`,
          templateFile: `${expoPath}env-development.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/index.js`,
          templateFile: `${expoPath}index.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/metro.config.js`,
          templateFile: `${expoPath}metro.config.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/.env.example`,
          templateFile: `${expoPath}env.example.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/scripts/add_xcconfig.rb`,
          templateFile: `${expoPath}/scripts/add_xcconfig.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/scripts/prebuild.ts`,
          templateFile: `${expoPath}/scripts/prebuild.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/README.md`,
          templateFile: `${expoPath}README.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/eas_hooks/eas-build-pre-install.sh`,
          templateFile: `${expoPath}/eas_hooks/eas-build-pre-install.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/eas_hooks/eas-build-post-install.sh`,
          templateFile: `${expoPath}eas_hooks/eas-build-post-install.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/eas_hooks/eas-run-with-env.sh`,
          templateFile: `${expoPath}eas_hooks/eas-run-with-env.hbs`
        }
      ] satisfies PlopTypes.ActionType[])
    )
  }

  if (storybook) {
    actions.push(
      ...([
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/.ondevice/index.tsx`,
          templateFile: `${sharedPath}.ondevice/index.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/.ondevice/main.ts`,
          templateFile: `${sharedPath}.ondevice/main.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/.ondevice/preview.tsx`,
          templateFile: `${sharedPath}.ondevice/preview.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/.storybook/main.tsx`,
          templateFile: `${sharedPath}.storybook/main.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/.storybook/preview.tsx`,
          templateFile: `${sharedPath}.storybook/preview.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/AppEntryPoint.tsx`,
          templateFile: `${sharedPath}AppEntryPoint.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/src/components/button.tsx`,
          templateFile: `${sharedPath}src/components/button.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/src/stories/button.stories.tsx`,
          templateFile: `${sharedPath}src/stories/button.stories.hbs`
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/typescript/apps/${appName}/extended-expo-plugins.json`,
          templateFile: `${expoPath}extended-expo-plugins.hbs`
        }
      ] satisfies PlopTypes.ActionType[])
    )
  }

  const populatedActions = actions.map((action) => ({
    ...action,
    data: templateProps
  }))

  return populatedActions
}
