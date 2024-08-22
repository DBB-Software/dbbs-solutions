import { PlopTypes } from '@turbo/gen'

const SNAKE_CASE_PATTERN = /^[a-z]+(_[a-z]+)*$/

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('django-server', {
    description: 'Create a new Django Server API',
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
        type: 'input',
        name: 'module',
        message: 'What is the name of a settings module?',
        validate: (value) => {
          if (!value?.trim()) {
            return 'Name is required property'
          }

          if (!SNAKE_CASE_PATTERN.test(value)) {
            return 'Name must be in snake_case format'
          }

          return true
        }
      }
    ],
    actions: [
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/package.json',
        templateFile: 'django-server/templates/package-json.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/README.md',
        templateFile: 'django-server/templates/README.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/pyproject.toml',
        templateFile: 'django-server/templates/pyproject.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/manage.py',
        templateFile: 'django-server/templates/manage.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/{{ module }}/__init__.py',
        templateFile: 'django-server/templates/core/__init__.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/{{ module }}/asgi.py',
        templateFile: 'django-server/templates/core/asgi.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/{{ module }}/urls.py',
        templateFile: 'django-server/templates/core/urls.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/{{ module }}/wsgi.py',
        templateFile: 'django-server/templates/core/wsgi.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/{{ module }}/settings/__init__.py',
        templateFile: 'django-server/templates/core/settings/__init__.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/{{ module }}/settings/base.py',
        templateFile: 'django-server/templates/core/settings/base.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/{{ module }}/settings/dev.py',
        templateFile: 'django-server/templates/core/settings/dev.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/{{ module }}/settings/local.py',
        templateFile: 'django-server/templates/core/settings/local.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/{{ module }}/settings/prod.py',
        templateFile: 'django-server/templates/core/settings/prod.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/{{ module }}/settings/test.py',
        templateFile: 'django-server/templates/core/settings/test.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/example_module/__init__.py',
        templateFile: 'django-server/templates/example_module/__init__.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/example_module/admin.py',
        templateFile: 'django-server/templates/example_module/admin.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/example_module/apps.py',
        templateFile: 'django-server/templates/example_module/apps.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/example_module/models.py',
        templateFile: 'django-server/templates/example_module/models.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/example_module/serializers.py',
        templateFile: 'django-server/templates/example_module/serializers.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/example_module/tests.py',
        templateFile: 'django-server/templates/example_module/tests.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/example_module/urls.py',
        templateFile: 'django-server/templates/example_module/urls.hbs'
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/{{ name }}/example_module/views.py',
        templateFile: 'django-server/templates/example_module/views.hbs'
      }
    ]
  })
}
