import { type PlopTypes } from '@turbo/gen'
import { AppTypes } from '../config'

export const generateRN = (answers: Parameters<PlopTypes.DynamicActionsFunction>[0]) => {
  if (!answers) return []

  const appName = answers.name
  const { storybook, storage, appType } = answers
  const isExpo = appType === AppTypes.EXPO
  const isReactNative = appType === AppTypes.REACT_NATIVE_CLI
  const appNameInLowerCase = answers.name.toLowerCase()
  const templateProps = { appNameInLowerCase, appName, storybook, storage, isExpo, isReactNative }

  const actions = [
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/.eslintrc.json`,
      templateFile: 'mobile-app/templates/eslint-config.hbs'
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/Gemfile`,
      templateFile: 'mobile-app/templates/Gemfile.hbs'
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/jest.config.ts`,
      templateFile: 'mobile-app/templates/jest-config.hbs'
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
      templateFile: 'mobile-app/templates/tsconfig-app-json.hbs',
      data: templateProps
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
      templateFile: 'mobile-app/templates/__tests__/testUtils/setupTests.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/.detoxrc.cjs`,
      templateFile: 'mobile-app/templates/detoxrc.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/detox.config.ts`,
      templateFile: 'mobile-app/templates/detox.config.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/e2e/tsconfig.json`,
      templateFile: 'mobile-app/templates/e2e/tsconfig-json.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/e2e/testUtils/setupTests.ts`,
      templateFile: 'mobile-app/templates/e2e/testUtils/setupTests.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/e2e/start-up/starter.e2e.ts`,
      templateFile: 'mobile-app/templates/e2e/start-up/starter.e2e.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/src/sentry/index.ts`,
      templateFile: 'mobile-app/templates/src/sentry/index.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/src/sentry/init.ts`,
      templateFile: 'mobile-app/templates/src/sentry/init.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/src/app/locale/en.json`,
      templateFile: 'mobile-app/templates/src/app/locale/en.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/src/app/locale/de.json`,
      templateFile: 'mobile-app/templates/src/app/locale/de.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/apps/${appName}/src/app/locale/index.ts`,
      templateFile: 'mobile-app/templates/src/app/locale/index.hbs',
      data: templateProps
    }
  ]

  if (isReactNative) {
    actions.push(
      ...([
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/app.json`,
          templateFile: 'mobile-app/templates/react-native/app-json.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/firebase.json`,
          templateFile: 'mobile-app/templates/react-native/firebase-json.hbs'
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/babel.config.cjs`,
          templateFile: 'mobile-app/templates/react-native/babel-config.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/index.js`,
          templateFile: 'mobile-app/templates/react-native/index.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/__tests__/__mocks__/react-native-config.ts`,
          templateFile: 'mobile-app/templates/__tests__/__mocks__/react-native-config.hbs'
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/__tests__/__mocks__/react-native-localize.ts`,
          templateFile: 'mobile-app/templates/__tests__/__mocks__/react-native-localize.hbs'
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/.env.example`,
          templateFile: 'mobile-app/templates/react-native/env.example.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/metro.config.cjs`,
          templateFile: 'mobile-app/templates/react-native/metro-config.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/README.md`,
          templateFile: 'mobile-app/templates/react-native/README.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/scripts/prebuild.sh`,
          templateFile: 'mobile-app/templates/react-native/prebuild.hbs',
          data: templateProps
        }
      ] satisfies PlopTypes.ActionType[])
    )
  }

  if (isExpo) {
    actions.push(
      ...([
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/app.json`,
          templateFile: 'mobile-app/templates/expo/app.json.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/app.config.ts`,
          templateFile: 'mobile-app/templates/expo/app.config.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/babel.config.js`,
          templateFile: 'mobile-app/templates/expo/babel.config.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/credentials-example.json`,
          templateFile: 'mobile-app/templates/expo/credentials-example.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/eas.json`,
          templateFile: 'mobile-app/templates/expo/eas.json.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/.env.production`,
          templateFile: 'mobile-app/templates/expo/env-production.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/.env.development`,
          templateFile: 'mobile-app/templates/expo/env-development.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/index.js`,
          templateFile: 'mobile-app/templates/expo/index.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/metro.config.js`,
          templateFile: 'mobile-app/templates/expo/metro.config.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/.env.example`,
          templateFile: 'mobile-app/templates/expo/env.example.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/prebuild-cleanup.sh`,
          templateFile: 'mobile-app/templates/expo/prebuild-cleanup.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/README.md`,
          templateFile: 'mobile-app/templates/expo/README.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/eas_hooks/eas-build-pre-install.sh`,
          templateFile: 'mobile-app/templates/expo//eas_hooks/eas-build-pre-install.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/eas_hooks/eas-build-post-install.sh`,
          templateFile: 'mobile-app/templates/expo/eas_hooks/eas-build-post-install.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/eas_hooks/eas-run-with-env.sh`,
          templateFile: 'mobile-app/templates/expo/eas_hooks/eas-run-with-env.hbs',
          data: templateProps
        }
      ] satisfies PlopTypes.ActionType[])
    )
  }

  if (storybook) {
    actions.push(
      ...([
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/.ondevice/index.tsx`,
          templateFile: 'mobile-app/templates/.ondevice/index.hbs'
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/.ondevice/main.ts`,
          templateFile: 'mobile-app/templates/.ondevice/main.hbs'
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/.ondevice/preview.tsx`,
          templateFile: 'mobile-app/templates/.ondevice/preview.hbs'
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/.storybook/main.tsx`,
          templateFile: 'mobile-app/templates/.storybook/main.hbs'
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/.storybook/preview.tsx`,
          templateFile: 'mobile-app/templates/.storybook/preview.hbs'
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/AppEntryPoint.tsx`,
          templateFile: 'mobile-app/templates/AppEntryPoint.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/src/components/button.tsx`,
          templateFile: 'mobile-app/templates/src/components/button.hbs'
        },
        {
          type: 'add',
          path: `{{ turbo.paths.root }}/apps/${appName}/src/stories/button.stories.tsx`,
          templateFile: 'mobile-app/templates/src/stories/button.stories.hbs'
        }
      ] satisfies PlopTypes.ActionType[])
    )
  }

  return actions
}
