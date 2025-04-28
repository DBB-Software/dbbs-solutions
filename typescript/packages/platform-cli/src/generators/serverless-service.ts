/* eslint-disable no-param-reassign */
import { CustomActionFunction, NodePlopAPI } from 'plop'
import { TURBO_GENERATORS_BASE_URL } from '../constants.js'
import {
  fetchTemplateContent,
  generateTemplateActions,
  sanitizeTemplateKey,
  getProjectVersion
} from '../utils/index.js'

const fetchTemplates: CustomActionFunction = async (answers, _config, plop) => {
  if (!answers) throw new Error('Answers not provided.')

  // List of template files
  const templates = [
    'package-json.hbs',
    'tsconfig.hbs',
    'tsconfig.spec.hbs',
    'jest-config.hbs',
    'eslint-config.hbs',
    'serverless.hbs',
    'env.hbs',
    'env.example.hbs',
    'src/handler.hbs',
    '__tests__/handler.test.hbs'
  ]

  const releaseVersion = await getProjectVersion()

  // Fetch all templates and store them in an object with sanitized keys
  const fetchPromises = templates.map((template) =>
    fetchTemplateContent(
      `/release-${releaseVersion}/${TURBO_GENERATORS_BASE_URL}/serverless-service/templates/${template}`,
      answers,
      plop
    ).then((renderedContent) => ({
      key: sanitizeTemplateKey(template), // Sanitize the template key
      content: renderedContent
    }))
  )

  // Wait for all templates to be fetched in parallel
  const fetchedTemplates = await Promise.all(fetchPromises)

  // Attach the rendered templates to the answers object as a named object
  answers.templates = fetchedTemplates.reduce((acc: Record<string, string>, { key, content }) => {
    if (key) acc[key] = content // Store template content by its sanitized key
    return acc
  }, {})

  return 'Templates fetched and ready for use!'
}

// Generator configuration function
export default async function generator(plop: NodePlopAPI): Promise<void> {
  const generatorConfig = {
    description: 'Create a new Serverless Service',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the new application (e.g. serverless-service)?'
      },
      {
        type: 'confirm',
        name: 'wantAPI',
        message: 'Do you want to use an API endpoint?'
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
    actions: [
      // Step 1: Fetch templates
      fetchTemplates,

      // Step 2: Add files using fetched templates
      ...generateTemplateActions({
        'package.json': 'package-json.hbs',
        'tsconfig.json': 'tsconfig.hbs',
        'tsconfig.spec.json': 'tsconfig.spec.hbs',
        'jest.config.ts': 'jest-config.hbs',
        '.eslintrc.json': 'eslint-config.hbs',
        'serverless.yml': 'serverless.hbs',
        '.env': 'env.hbs',
        '.env.example': 'env.example.hbs',
        'src/handler.ts': 'src/handler.hbs',
        '__tests__/handler.test.ts': '__tests__/handler.test.hbs'
      })
    ]
  }

  // Dynamically register the generator based on configuration
  plop.setGenerator('serverless-service', generatorConfig)
}
