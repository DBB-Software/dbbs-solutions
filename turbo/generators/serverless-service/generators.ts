import { PlopTypes } from '@turbo/gen'

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('serverless-service', {
    description: 'Create a new Serverless Service',
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
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/handler.ts',
        templateFile: 'serverless-service/templates/src/handler.hbs'
      }
    ]
  })
}
