import { PlopTypes } from '@turbo/gen'

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('serverless-service', {
    description: 'Create a new Serverless Service',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of a new application (e.g. serverless-service)?'
      },
      {
        type: 'confirm',
        name: 'wantAPI',
        message: 'Do you want to use API endpoint?'
      },
      {
        type: 'confirm',
        name: 'wantLogger',
        message: 'Do you want to use logger middleware?'
      },
      {
        type: 'confirm',
        name: 'wantSettings',
        message: 'Do you want to use settings middleware?'
      }
    ],
    actions: (answers) => {
      const templateProps = {
        wantAPI: answers?.wantAPI,
        wantLogger: answers?.wantLogger,
        wantSettings: answers?.wantSettings
      }
      const actions = [
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/apps/{{ name }}/package.json',
          templateFile: 'serverless-service/templates/package-json.hbs'
        },
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/apps/{{ name }}/tsconfig.json',
          templateFile: 'serverless-service/templates/tsconfig.hbs'
        },
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/apps/{{ name }}/tsconfig.spec.json',
          templateFile: 'serverless-service/templates/tsconfig.spec.hbs'
        },
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/apps/{{ name }}/jest.config.ts',
          templateFile: 'serverless-service/templates/jest-config.hbs'
        },
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/apps/{{ name }}/.eslintrc.json',
          templateFile: 'serverless-service/templates/eslint-config.hbs'
        },
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/apps/{{ name }}/serverless.yml',
          templateFile: 'serverless-service/templates/serverless.hbs'
        },
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/apps/{{ name }}/.env',
          templateFile: 'serverless-service/templates/env.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/apps/{{ name }}/.env.example',
          templateFile: 'serverless-service/templates/env.example.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/apps/{{ name }}/src/handler.ts',
          templateFile: 'serverless-service/templates/src/handler.hbs',
          data: templateProps
        },
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/apps/{{ name }}/__tests__/handler.test.ts',
          templateFile: 'serverless-service/templates/__tests__/handler.test.hbs',
          data: templateProps
        }
      ]

      if (answers?.wantLogger) {
        // TODO add external modules
      }

      if (answers?.wantSettings) {
        // TODO add external modules
      }

      return actions
    }
  })
}
