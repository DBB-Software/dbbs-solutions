import { PlopTypes } from '@turbo/gen'

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('server-api', {
    description: 'Create a new Nest Server API',
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
        templateFile: 'server-api/templates/package-json.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/tsconfig.json',
        templateFile: 'server-api/templates/tsconfig.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/tsconfig.spec.json',
        templateFile: 'server-api/templates/tsconfig.spec.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/jest.config.ts',
        templateFile: 'server-api/templates/jest-config.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/.eslintrc.json',
        templateFile: 'server-api/templates/eslint-config.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/.nest-cli.json',
        templateFile: 'server-api/templates/nest-cli.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/.env.example',
        templateFile: 'server-api/templates/.env.example.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/app.module.ts',
        templateFile: 'server-api/templates/src/app.module.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/main.ts',
        templateFile: 'server-api/templates/src/main.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/cluster.ts',
        templateFile: 'server-api/templates/src/cluster.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/example-module/example.controller.ts',
        templateFile: 'server-api/templates/src/example-module/example.controller.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/example-module/example.e2e-spec.ts',
        templateFile: 'server-api/templates/src/example-module/example.e2e-spec.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/example-module/example.module.ts',
        templateFile: 'server-api/templates/src/example-module/example.module.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/example-module/example.service.ts',
        templateFile: 'server-api/templates/src/example-module/example.service.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/example-module/example.service.spec.ts',
        templateFile: 'server-api/templates/src/example-module/example.service.spec.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/src/types/example.ts',
        templateFile: 'server-api/templates/src/types/example.hbs'
      }
    ]
  })
}
