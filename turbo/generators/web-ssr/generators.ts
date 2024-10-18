import { PlopTypes } from '@turbo/gen'

enum StylingFrameworks {
  MUI = 'mui',
  TAILWIND = 'tailwind'
}

enum StoreFrameworks {
  ReduxToolkit = 'redux-toolkit',
  Jotai = 'jotai',
  none = 'none'
}
enum TypeRouter {
  pageRouter = 'page-router',
  appRouter = 'app-router'
}

enum DeploymentFrameworks {
  NextServerless = 'Next Serverless',
  Vercel = 'Vercel',
  None = 'none'
}

const generateApp = (answers: Parameters<PlopTypes.DynamicActionsFunction>[0]): PlopTypes.ActionType[] => {
  const appName = answers?.name
  const usePageRouter = answers?.typeRouter === TypeRouter.pageRouter
  const templateProps = {
    appName,
    cssFramework: answers?.cssFramework,
    isReduxToolkit: answers?.storeFramework === StoreFrameworks.ReduxToolkit,
    isJotaiStore: answers?.storeFramework === StoreFrameworks.Jotai,
    useServerless: answers?.deploymentFramework === DeploymentFrameworks.NextServerless,
    useVercel: answers?.deploymentFramework === DeploymentFrameworks.Vercel,
    typeRouter: answers?.typeRouter,
    usePageRouter,
    useMui: answers?.cssFramework === StylingFrameworks.MUI
  }

  const actions: PlopTypes.ActionType[] = [
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/apps/{{ name }}/tsconfig.json',
      templateFile: 'web-ssr/templates/tsconfig.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/apps/{{ name }}/tsconfig.spec.json',
      templateFile: 'web-ssr/templates/tsconfig.spec.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/apps/{{ name }}/tsconfig.app.json',
      templateFile: 'web-ssr/templates/tsconfig.app.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/apps/{{ name }}/jest.config.ts',
      templateFile: 'web-ssr/templates/jest-config.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/apps/{{ name }}/.eslintrc.json',
      templateFile: 'web-ssr/templates/eslint-config.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/apps/{{ name }}/next.config.js',
      templateFile: 'web-ssr/templates/next.config.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/apps/{{ name }}/next-env.d.ts',
      templateFile: 'web-ssr/templates/next-env.d.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/apps/{{ name }}/cypress.config.ts',
      templateFile: 'web-ssr/templates/cypress.config.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/apps/{{ name }}/cypress/tsconfig.json',
      templateFile: 'web-ssr/templates/cypress/tsconfig.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/apps/{{ name }}/cypress/e2e/home.cy.ts',
      templateFile: 'web-ssr/templates/cypress/e2e/home.cy.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/apps/{{ name }}/__tests__/index.spec.tsx',
      templateFile: 'web-ssr/templates/__tests__/index.spec.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/apps/{{ name }}/__tests__/testUtils/setupTests.ts',
      templateFile: 'web-ssr/templates/__tests__/testUtils/setupTests.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/apps/{{ name }}/package.json',
      templateFile: 'web-ssr/templates/package-json.hbs',
      data: templateProps
    }
  ]

  if (answers?.typeRouter === TypeRouter.appRouter) {
    actions.push(
      ...([
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/apps/{{ name }}/src/app/layout.tsx',
          templateFile: 'web-ssr/templates/src/app/layout.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/apps/{{ name }}/src/app/page.tsx',
          templateFile: 'web-ssr/templates/src/app/page.hbs',
          data: templateProps
        }
      ] satisfies PlopTypes.ActionType[])
    )
  }
  if (answers?.typeRouter === TypeRouter.pageRouter) {
    actions.push(
      ...([
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/apps/{{ name }}/src/pages/_app.tsx',
          templateFile: 'web-ssr/templates/src/pages/_app.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/apps/{{ name }}/src/pages/index.tsx',
          templateFile: 'web-ssr/templates/src/pages/index.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/apps/{{ name }}/src/pages/_document.tsx',
          templateFile: 'web-ssr/templates/src/pages/_document.hbs',
          data: templateProps
        }
      ] satisfies PlopTypes.ActionType[])
    )
  }

  if (templateProps.isReduxToolkit) {
    const baseActions = [
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/lib/store.ts',
        templateFile: 'web-ssr/templates/lib/store-rtk.hbs',
        data: templateProps
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/lib/hooks.ts',
        templateFile: 'web-ssr/templates/lib/hooks.hbs',
        data: templateProps
      }
    ]
    if (answers?.typeRouter === TypeRouter.appRouter) {
      baseActions.push({
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/app/StoreProvider.tsx',
        templateFile: 'web-ssr/templates/src/app/StoreProvider.hbs',
        data: templateProps
      })
    }
    actions.push(...(baseActions satisfies PlopTypes.ActionType[]))
  }
  if (templateProps.useServerless) {
    actions.push({
      type: 'add',
      path: '{{ turbo.paths.root }}/apps/{{ name }}/next-serverless.config.js',
      templateFile: 'web-ssr/templates/serverlessDeployment/serverless-deployment-config.hbs',
      data: templateProps
    })
  }

  if (templateProps.useVercel) {
    actions.push({
      type: 'add',
      path: '{{ turbo.paths.root }}/apps/{{ name }}/vercel.json',
      templateFile: 'web-ssr/templates/vercel-config.hbs'
    })
  }

  if (answers?.cssFramework === StylingFrameworks.TAILWIND) {
    actions.push(
      ...([
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/apps/{{ name }}/tailwind.config.js',
          templateFile: 'web-ssr/templates/tailwind-config.hbs'
        },
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/apps/{{ name }}/postcss.config.js',
          templateFile: 'web-ssr/templates/postcss-config.hbs'
        },
        {
          type: 'add',
          path:
            answers?.typeRouter === TypeRouter.appRouter
              ? '{{ turbo.paths.root }}/apps/{{ name }}/src/app/global.css'
              : '{{ turbo.paths.root }}/apps/{{ name }}/src/styles/global.css',
          templateFile: 'web-ssr/templates/src/app/global-css.hbs',
          data: templateProps
        }
      ] satisfies PlopTypes.ActionType[])
    )
  }

  if (answers?.cssFramework === StylingFrameworks.MUI) {
    actions.push({
      type: 'add',
      path:
        answers?.typeRouter === TypeRouter.appRouter
          ? '{{ turbo.paths.root }}/apps/{{ name }}/src/app/ThemeRegistry.tsx'
          : '{{ turbo.paths.root }}/apps/{{ name }}/src/ThemeRegistry.tsx',
      templateFile: 'web-ssr/templates/src/app/ThemeRegistry.hbs',
      transform(template) {
        return template.replace('STYLE_PLACEHOLDER', 'dangerouslySetInnerHTML={{\n\t\t\t\t\t__html: styles\n\t\t\t\t}}')
      }
    })
  }

  return actions
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('web-ssr', {
    description: 'Create a new Next app',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of a new application?'
      },
      {
        type: 'list',
        name: 'typeRouter',
        message: 'Choose the router type',
        choices: [TypeRouter.appRouter, TypeRouter.pageRouter]
      },
      {
        type: 'list',
        name: 'cssFramework',
        message: 'Choose the UI library what you want to use',
        choices: [StylingFrameworks.MUI, StylingFrameworks.TAILWIND]
      },
      {
        type: 'list',
        name: 'deploymentFramework',
        message: 'What do you want to use for deployment?',
        choices: [DeploymentFrameworks.NextServerless, DeploymentFrameworks.Vercel, DeploymentFrameworks.None]
      },
      {
        type: 'list',
        name: 'storeFramework',
        message: 'Choose the state management library what you want to use',
        choices: [StoreFrameworks.ReduxToolkit, StoreFrameworks.Jotai, StoreFrameworks.none]
      }
    ],
    actions: (answers) => generateApp(answers)
  })
}
