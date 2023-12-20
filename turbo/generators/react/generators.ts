// eslint-disable-next-line import/no-extraneous-dependencies
import { type PlopTypes } from '@turbo/gen'

enum Applications {
  SPA = 'react-spa',
  PACKAGE = 'react-package'
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
      templateFile: 'react/templates/cypress/home-test.hbs'
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
  const templateProps = { isAPP, appName: transformedAppName }

  const actions: PlopTypes.ActionType[] = [
    {
      type: 'add',
      path: `${basePath}/package.json`,
      templateFile: 'react/templates/package-json.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `${basePath}/tsconfig.json`,
      templateFile: 'react/templates/configs/tsconfig-root.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `${basePath}/tsconfig.${isAPP ? 'app' : 'lib'}.json`,
      templateFile: 'react/templates/configs/tsconfig-app.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `${basePath}/tsconfig.spec.json`,
      templateFile: 'react/templates/configs/tsconfig-spec.hbs'
    },
    {
      type: 'add',
      path: `${basePath}/jest.config.ts`,
      templateFile: 'react/templates/configs/jest-config.hbs'
    },
    {
      type: 'add',
      path: `${basePath}/.eslintrc.json`,
      templateFile: 'react/templates/configs/eslint-config.hbs'
    }
  ]

  if (isAPP) {
    const appActions: PlopTypes.ActionType[] = [
      {
        type: 'add',
        path: `${basePath}/vite-config.ts`,
        templateFile: 'react/templates/configs/vite-config.hbs',
        data: templateProps
      },
      {
        type: 'add',
        path: `${basePath}/cypress.config.ts`,
        templateFile: 'react/templates/configs/cypress.hbs',
        data: templateProps
      },
      {
        type: 'add',
        path: `${basePath}/cypress/tsconfig.json`,
        templateFile: 'react/templates/configs/tsconfig-cypress.hbs'
      }
    ]

    actions.push(...appActions)
  }

  return actions
}

const generateSPAFiles = (): PlopTypes.ActionType[] => [
  {
    type: 'add',
    path: '{{ turbo.paths.root }}/apps/{{ name }}/index.html',
    templateFile: 'react/templates/spa/main-html.hbs'
  },
  {
    type: 'add',
    path: '{{ turbo.paths.root }}/apps/{{ name }}/src/main.tsx',
    templateFile: 'react/templates/spa/main-entry.hbs'
  },
  {
    type: 'add',
    path: '{{ turbo.paths.root }}/apps/{{ name }}/src/App.tsx',
    templateFile: 'react/templates/spa/app-component.hbs'
  },
  {
    type: 'add',
    path: '{{ turbo.paths.root }}/apps/{{ name }}/src/App.spec.tsx',
    templateFile: 'react/templates/spa/app-test.hbs'
  },
  {
    type: 'add',
    path: '{{ turbo.paths.root }}/apps/{{ name }}/src/testUtils/setupTests.ts',
    templateFile: 'react/templates/utils/test-utils.hbs'
  }
]

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator(Applications.SPA, {
    description: 'Create a new React SPA',
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
      }
    ],
    actions: (answers) => [
      ...generateConfigs(Applications.SPA, answers),
      ...generateSPAFiles(),
      ...generateCypressActions(Applications.SPA)
    ]
  })
  plop.setGenerator('react-package', {
    description: 'Create a new React package',
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
        templateFile: 'react/templates/jest/test-utils.hbs'
      }
    ]
  })
}
