import { type PlopTypes } from '@turbo/gen'

enum Applications {
  SPA = 'web-spa',
  PACKAGE = 'web-spa-package'
}

enum StylingFrameworks {
  MUI = 'mui',
  TAILWIND = 'tailwind'
}

enum StoreFrameworks {
  ReduxToolkit = 'redux-toolkit',
  Jotai = 'jotai',
  none = 'none'
}

enum DeploymentFrameworks {
  NextServerless = 'Next Serverless',
  Vercel = 'Vercel',
  None = 'none'
}

const appBasePaths: Record<Applications, string> = {
  [Applications.SPA]: 'apps',
  [Applications.PACKAGE]: 'packages'
}

const generateCypressActions = (type: Applications): PlopTypes.ActionType[] => {
  const basePath = `{{ turbo.paths.root }}/${appBasePaths[type]}/{{ name }}/cypress`

  return [
    {
      type: 'add',
      path: `${basePath}/e2e/home.cy.ts`,
      templateFile: 'web-spa/templates/cypress/home-test.hbs'
    }
  ]
}

const generateConfigs = (
  type: Applications,
  answers: Parameters<PlopTypes.DynamicActionsFunction>[0]
): PlopTypes.ActionType[] => {
  const basePath = `{{ turbo.paths.root }}/${appBasePaths[type]}/{{name}}`
  const isAPP = type === Applications.SPA
  const transformedAppName = answers?.name.replace(/-/g, '_').toUpperCase()
  const templateProps = {
    isAPP,
    appName: transformedAppName,
    cssFramework: answers?.cssFramework,
    isTanstackRouterEnabled: answers?.isTanstackRouterEnabled,
    storeFramework: answers?.storeFramework
  }

  const actions: PlopTypes.ActionType[] = [
    {
      type: 'add',
      path: `${basePath}/package.json`,
      templateFile: 'web-spa/templates/package-json.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `${basePath}/tsconfig.json`,
      templateFile: 'web-spa/templates/configs/tsconfig-root.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `${basePath}/tsconfig.${isAPP ? 'app' : 'lib'}.json`,
      templateFile: 'web-spa/templates/configs/tsconfig-app.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `${basePath}/tsconfig.spec.json`,
      templateFile: 'web-spa/templates/configs/tsconfig-spec.hbs'
    },
    {
      type: 'add',
      path: `${basePath}/jest.config.ts`,
      templateFile: 'web-spa/templates/configs/jest-config.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `${basePath}/.eslintrc.json`,
      templateFile: 'web-spa/templates/configs/eslint-config.hbs'
    }
  ]

  if (isAPP) {
    actions.push(
      ...([
        {
          type: 'add',
          path: `${basePath}/vite.config.ts`,
          templateFile: 'web-spa/templates/configs/vite-config.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: `${basePath}/cypress.config.ts`,
          templateFile: 'web-spa/templates/configs/cypress.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: `${basePath}/cypress/tsconfig.json`,
          templateFile: 'web-spa/templates/configs/tsconfig-cypress.hbs'
        }
      ] satisfies PlopTypes.ActionType[])
    )
  }

  if (answers?.cssFramework === StylingFrameworks.TAILWIND) {
    actions.push(
      ...([
        {
          type: 'add',
          path: `${basePath}/tailwind.config.js`,
          templateFile: 'web-spa/templates/configs/tailwind-config.hbs'
        },
        {
          type: 'add',
          path: `${basePath}/postcss.config.js`,
          templateFile: 'web-spa/templates/configs/postcss-config.hbs'
        }
      ] satisfies PlopTypes.ActionType[])
    )
  }

  return actions
}

const generateSPAFiles = (answers: Parameters<PlopTypes.DynamicActionsFunction>[0]): PlopTypes.ActionType[] => {
  const templateProps = {
    cssFramework: answers?.cssFramework,
    isMUI: answers?.cssFramework === StylingFrameworks.MUI,
    isTailwind: answers?.cssFramework === StylingFrameworks.TAILWIND,
    isTanstackRouterEnabled: answers?.isTanstackRouterEnabled,
    useVercel: answers?.deploymentFramework === DeploymentFrameworks.Vercel,
    isReduxToolkit: answers?.storeFramework === StoreFrameworks.ReduxToolkit
  }
  const actions: PlopTypes.ActionType[] = [
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/apps/{{ name }}/index.html',
      templateFile: 'web-spa/templates/spa/main-html.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/apps/{{ name }}/src/main.tsx',
      templateFile: 'web-spa/templates/spa/main-entry.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/apps/{{ name }}/src/App.tsx',
      templateFile: 'web-spa/templates/spa/app-component.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/apps/{{ name }}/src/App.spec.tsx',
      templateFile: 'web-spa/templates/spa/app-test.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/apps/{{ name }}/src/testUtils/setupTests.ts',
      templateFile: 'web-spa/templates/utils/test-utils.hbs',
      data: templateProps
    }
  ]

  if (answers?.cssFramework === StylingFrameworks.TAILWIND) {
    actions.push(
      ...([
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/apps/{{ name }}/src/testUtils/emptyCss.ts',
          templateFile: 'web-spa/templates/utils/test-utils.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/apps/{{ name }}/src/index.css',
          templateFile: 'web-spa/templates/spa/css.hbs',
          data: templateProps
        }
      ] satisfies PlopTypes.ActionType[])
    )
  }

  if (answers?.isTanstackRouterEnabled) {
    actions.push(
      ...([
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/apps/{{ name }}/src/routes/__root.tsx',
          templateFile: 'web-spa/templates/spa/root-tanstack.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/apps/{{ name }}/src/routes/index.lazy.tsx',
          templateFile: 'web-spa/templates/spa/index-tanstack.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/apps/{{ name }}/src/routeTree.gen.ts',
          templateFile: 'web-spa/templates/spa/default-root-tree.hbs',
          data: templateProps
        }
      ] satisfies PlopTypes.ActionType[])
    )
  }

  if (answers?.storeFramework === StoreFrameworks.ReduxToolkit) {
    actions.push(
      ...([
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/apps/{{ name }}/src/store/index.ts',
          templateFile: 'web-spa/templates/store/index-rtk.hbs',
          data: templateProps
        }
      ] satisfies PlopTypes.ActionType[])
    )
  }

  if (templateProps.useVercel) {
    actions.push({
      type: 'add',
      path: '{{ turbo.paths.root }}/apps/{{ name }}/vercel.json',
      templateFile: 'web-spa/templates/configs/vercel-config.hbs'
    })
  }
  return actions
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator(Applications.SPA, {
    description: 'Create a new Web SPA',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of a new application?',
        validate: (value) => {
          if (!value?.trim()) {
            return 'Name is required property'
          }

          return true
        }
      },
      {
        type: 'list',
        name: 'cssFramework',
        message: 'Choose the UI library what you want to use',
        choices: [StylingFrameworks.MUI, StylingFrameworks.TAILWIND]
      },
      { type: 'confirm', name: 'isTanstackRouterEnabled', message: 'Do you want to use Tanstack Router?' },
      {
        type: 'list',
        name: 'storeFramework',
        message: 'Choose the state management library what you want to use',
        choices: [StoreFrameworks.ReduxToolkit, StoreFrameworks.Jotai, StoreFrameworks.none]
      },
      {
        type: 'list',
        name: 'deploymentFramework',
        message: 'What do you want to use for deployment?',
        choices: [DeploymentFrameworks.NextServerless, DeploymentFrameworks.Vercel, DeploymentFrameworks.None]
      }
    ],
    actions: (answers) => [
      ...generateConfigs(Applications.SPA, answers),
      ...generateSPAFiles(answers),
      ...generateCypressActions(Applications.SPA)
    ]
  })
  plop.setGenerator(Applications.PACKAGE, {
    description: 'Create a new Web SPA package',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of a new package?',
        validate: (value) => {
          if (!value?.trim()) {
            return 'Name is required property'
          }

          return true
        }
      }
    ],
    actions: (answers) => [
      ...generateConfigs(Applications.PACKAGE, answers),
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/packages/{{ name }}/src/index.ts',
        templateFile: 'templates/empty.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/packages/{{ name }}/src/testUtils/setupTests.ts',
        templateFile: 'web-spa/templates/utils/test-utils.hbs'
      }
    ]
  })
}
