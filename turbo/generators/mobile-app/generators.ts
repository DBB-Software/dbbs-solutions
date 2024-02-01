import { type PlopTypes } from '@turbo/gen'
import { execSync } from 'child_process'
import { generateAndroid, generateFastlane, generateIos, generateRN } from './scripts'

const GENERATOR_NAME = 'mobile-app'
const REACT_NATIVE_VERSION = '0.73.1'
const GENERATE_TEMPLATE = 'GENERATE_TEMPLATE'
const CLEAN_UNWANTED_FILES = 'CLEAN_UNWANTED_FILES'

const generateBaseRNTemplateAction: PlopTypes.CustomActionFunction = (
  answers: Parameters<PlopTypes.DynamicActionsFunction>[0]
) => {
  const foldername = answers?.name
  const currentDirectory = process.cwd()

  execSync(
    `cd apps && npx react-native@${REACT_NATIVE_VERSION} init ${foldername} --version ${REACT_NATIVE_VERSION} && cd ..`
  )

  execSync(`mkdir -p ${currentDirectory}/apps/${foldername}/fastlane`)

  return GENERATE_TEMPLATE
}
const cleanUnwantedFilesAction: PlopTypes.CustomActionFunction = (
  answers: Parameters<PlopTypes.DynamicActionsFunction>[0]
) => {
  const foldername = answers?.name

  execSync(
    `cd apps/${foldername} && rm -rf node_modules __tests__ .gitignore Gemfile *.js *.tsx *.json *.md .eslintrc.js .prettierrc.js`
  )

  return CLEAN_UNWANTED_FILES
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setActionType(GENERATE_TEMPLATE, (answers) => {
    generateBaseRNTemplateAction(answers)

    return GENERATE_TEMPLATE
  })
  plop.setActionType(CLEAN_UNWANTED_FILES, (answers) => {
    cleanUnwantedFilesAction(answers)

    return CLEAN_UNWANTED_FILES
  })
  plop.setGenerator(GENERATOR_NAME, {
    description: 'Create a new mobile app',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of a new mobile app?',
        validate: (value) => {
          if (!value?.trim()) {
            return 'Name is required property'
          }

          return true
        }
      }
    ],
    actions: (answers) => [
      { type: GENERATE_TEMPLATE },
      { type: CLEAN_UNWANTED_FILES },
      ...generateRN(answers),
      ...generateAndroid(answers),
      ...generateIos(answers),
      ...generateFastlane(answers)
    ]
  })
}
