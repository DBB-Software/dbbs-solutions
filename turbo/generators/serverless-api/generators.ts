import { PlopTypes } from '@turbo/gen'

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('serverless-api', {
    description: 'Create a new Nest Serverless API',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of a new application?'
      }
    ],
    actions: [
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/package.json',
        templateFile: 'serverless-api/templates/package-json.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/tsconfig.json',
        templateFile: 'serverless-api/templates/tsconfig.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/tsconfig.spec.json',
        templateFile: 'serverless-api/templates/tsconfig.spec.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/jest.config.ts',
        templateFile: 'serverless-api/templates/jest-config.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/.eslintrc.json',
        templateFile: 'serverless-api/templates/eslint-config.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/.nest-cli.json',
        templateFile: 'serverless-api/templates/nest-cli.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/serverless.yml',
        templateFile: 'serverless-api/templates/serverless.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/README.md',
        templateFile: 'serverless-api/templates/README.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/app.module.ts',
        templateFile: 'serverless-api/templates/src/app.module.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/logger.config.ts',
        templateFile: 'serverless-api/templates/src/logger.config.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/constants.ts',
        templateFile: 'serverless-api/templates/src/constants.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/lambda.ts',
        templateFile: 'serverless-api/templates/src/lambda.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/main.ts',
        templateFile: 'serverless-api/templates/src/main.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/asyncContextStorage.ts',
        templateFile: 'serverless-api/templates/src/asyncContextStorage.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/nestApp.ts',
        templateFile: 'serverless-api/templates/src/nestApp.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/example-module/example.controller.ts',
        templateFile: 'serverless-api/templates/src/example-module/example.controller.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/example-module/example.e2e-spec.ts',
        templateFile: 'serverless-api/templates/src/example-module/example.e2e-spec.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/example-module/example.module.ts',
        templateFile: 'serverless-api/templates/src/example-module/example.module.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/example-module/example.service.ts',
        templateFile: 'serverless-api/templates/src/example-module/example.service.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/example-module/example.service.spec.ts',
        templateFile: 'serverless-api/templates/src/example-module/example.service.spec.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/types/example.ts',
        templateFile: 'serverless-api/templates/src/types/example.hbs'
      }
    ]
  })
}
