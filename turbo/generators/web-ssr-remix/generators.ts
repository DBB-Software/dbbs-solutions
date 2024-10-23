import { PlopTypes } from '@turbo/gen'

enum StylingFrameworks {
  MUI = 'mui',
  TAILWIND = 'tailwind',
  None = 'none'
}

const generateApp = (answers: Parameters<PlopTypes.DynamicActionsFunction>[0]): PlopTypes.ActionType[] => {
  const templateProps = {
    appName: answers?.name,
    isMUI: answers?.cssFramework === StylingFrameworks.MUI,
    isTailwind: answers?.cssFramework === StylingFrameworks.TAILWIND
  }
  const actions: PlopTypes.ActionType[] = [
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/typescript/apps/{{ name }}/package.json',
      templateFile: 'web-ssr-remix/templates/package-json.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/typescript/apps/{{ name }}/README.md',
      templateFile: 'web-ssr-remix/templates/readme.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/typescript/apps/{{ name }}/tsconfig.json',
      templateFile: 'web-ssr-remix/templates/tsconfig.hbs'
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/typescript/apps/{{ name }}/tsconfig.app.json',
      templateFile: 'web-ssr-remix/templates/tsconfig.app.hbs'
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/typescript/apps/{{ name }}/tsconfig.spec.json',
      templateFile: 'web-ssr-remix/templates/tsconfig.spec.hbs'
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/typescript/apps/{{ name }}/vite.config.ts',
      templateFile: 'web-ssr-remix/templates/vite.config.hbs'
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/typescript/apps/{{ name }}/app/root.tsx',
      templateFile: 'web-ssr-remix/templates/app/root.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/typescript/apps/{{ name }}/app/routes/_index.tsx',
      templateFile: 'web-ssr-remix/templates/app/routes/_index.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/typescript/apps/{{ name }}/__tests__/index.spec.tsx',
      templateFile: 'web-ssr-remix/templates/__tests__/index.spec.hbs'
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/typescript/apps/{{ name }}/__tests__/testUtils/setupTests.ts',
      templateFile: 'web-ssr-remix/templates/__tests__/testUtils/setupTests.hbs'
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/typescript/apps/{{ name }}/jest.config.ts',
      templateFile: 'web-ssr-remix/templates/jest-config.hbs'
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/typescript/apps/{{ name }}/.eslintrc.json',
      templateFile: 'web-ssr-remix/templates/eslintrs.hbs'
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/typescript/apps/{{ name }}/cypress.config.ts',
      templateFile: 'web-ssr-remix/templates/cypress-config.hbs'
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/typescript/apps/{{ name }}/cypress/tsconfig.json',
      templateFile: 'web-ssr-remix/templates/cypress/tsconfig.hbs'
    },
    {
      type: 'add',
      path: '{{ turbo.paths.root }}/typescript/apps/{{ name }}/cypress/e2e/index.cy.ts',
      templateFile: 'web-ssr-remix/templates/cypress/e2e/index.cy.hbs'
    }
  ]

  if (templateProps.isTailwind) {
    actions.push(
      ...([
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/typescript/apps/{{ name }}/tailwind.config.ts',
          templateFile: 'web-ssr-remix/templates/tailwind.config.hbs'
        },
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/typescript/apps/{{ name }}/postcss.config.js',
          templateFile: 'web-ssr-remix/templates/postcss.config.hbs'
        },
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/typescript/apps/{{ name }}/app/tailwind.css',
          templateFile: 'web-ssr-remix/templates/app/tailwind-css.hbs'
        }
      ] satisfies PlopTypes.ActionType[])
    )
  }
  if (templateProps.isMUI) {
    actions.push(
      ...([
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/typescript/apps/{{ name }}/app/entry.client.tsx',
          templateFile: 'web-ssr-remix/templates/app/entry.client.hbs'
        },
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/typescript/apps/{{ name }}/app/mui/MuiDocument.tsx',
          templateFile: 'web-ssr-remix/templates/app/mui/MuiDocument.hbs'
        },
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/typescript/apps/{{ name }}/app/mui/MuiProvider.tsx',
          templateFile: 'web-ssr-remix/templates/app/mui/MuiProvider.hbs'
        }
      ] satisfies PlopTypes.ActionType[])
    )
  }

  return actions
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('web-ssr-remix', {
    description: 'Create a new Remix app',
    prompts: [
      { type: 'input', name: 'name', message: 'What is the name of a new application?' },
      {
        type: 'list',
        name: 'cssFramework',
        message: 'Choose the UI library what you want to use',
        choices: [StylingFrameworks.MUI, StylingFrameworks.TAILWIND, StylingFrameworks.None]
      }
    ],
    actions: (answers) => generateApp(answers)
  })
}
