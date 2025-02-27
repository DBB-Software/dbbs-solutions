import { execSync } from 'child_process'
import { PlopTypes } from '@turbo/gen'

import { Answers } from '../types'

enum Applications {
  SPA = 'web-spa-vue'
}

enum E2EFrameworks {
  CYPRESS = 'Cypress',
  NIGHTWATCH = 'Nightwatch',
  PLAYWRIGHT = 'Playwright'
}

enum CreateVueFlags {
  TS = 'ts',
  JSX = 'jsx',
  ROUTER = 'router',
  PINIA = 'pinia',
  VITEST = 'vitest',
  ESLINT = 'eslint',
  ESLINT_WITH_PRETTIER = 'eslint-with-prettier',
  PRETTIER = 'prettier',
  CYPRESS = 'cypress',
  NIGHTWATCH = 'nightwatch',
  PLAYWRIGHT = 'playwright'
}

enum GeneratorQuestions {
  NAME = 'name',
  TS = 'ts',
  JSX = 'jsx',
  ROUTER = 'router',
  PINIA = 'pinia',
  VITEST = 'vitest',
  E2E = 'e2e',
  ESLINT = 'eslint',
  PRETTIER = 'prettier'
}

type GeneratorAnswers = Parameters<PlopTypes.DynamicActionsFunction>[0]

const NEGATIVE_FLAG_PREFIX = 'no-'

const formatFlag = (flag: string) => `--${flag}`

const buildFlag = (answer: Answers, flag: CreateVueFlags) => {
  const isYes = answer === Answers.YES
  return formatFlag(isYes ? flag : `${NEGATIVE_FLAG_PREFIX}${flag}`)
}

const E2E_OPTIONS_MAP: Record<E2EFrameworks, CreateVueFlags> = {
  [E2EFrameworks.CYPRESS]: CreateVueFlags.CYPRESS,
  [E2EFrameworks.NIGHTWATCH]: CreateVueFlags.NIGHTWATCH,
  [E2EFrameworks.PLAYWRIGHT]: CreateVueFlags.PLAYWRIGHT
}

const buildEslintFlag = (answers: NonNullable<GeneratorAnswers>) => {
  const isEslintYes = answers[GeneratorQuestions.ESLINT] === Answers.YES
  const isPretiierYes = isEslintYes && answers[GeneratorQuestions.PRETTIER] === Answers.YES

  if (isPretiierYes) return formatFlag(CreateVueFlags.ESLINT_WITH_PRETTIER)

  return buildFlag(answers[GeneratorQuestions.ESLINT], CreateVueFlags.ESLINT)
}

const buildE2EFlag = (answer: Answers.NO | E2EFrameworks) =>
  answer === Answers.NO ? '' : formatFlag(E2E_OPTIONS_MAP[answer])

const buildConfigurationFlags = (answers: NonNullable<GeneratorAnswers>) =>
  [
    buildFlag(answers[GeneratorQuestions.TS], CreateVueFlags.TS),
    buildFlag(answers[GeneratorQuestions.JSX], CreateVueFlags.JSX),
    buildFlag(answers[GeneratorQuestions.ROUTER], CreateVueFlags.ROUTER),
    buildFlag(answers[GeneratorQuestions.PINIA], CreateVueFlags.PINIA),
    buildFlag(answers[GeneratorQuestions.VITEST], CreateVueFlags.VITEST),
    buildEslintFlag(answers),
    buildE2EFlag(answers[GeneratorQuestions.E2E])
  ]
    .filter(Boolean)
    .join(' ')

const CREATE_VUE_VERSION = '3.14.1'
const APP_FOLDER_PATH = 'typescript/apps/'

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setActionType('createVue', (answers: GeneratorAnswers) => {
    if (!answers) return ''

    const appName = answers[GeneratorQuestions.NAME]
    const flags = buildConfigurationFlags(answers)

    const command = `cd ${APP_FOLDER_PATH} && yarn dlx create-vue@${CREATE_VUE_VERSION} ${appName} --default ${flags}`
    const output = execSync(command, {
      input: 'Yes\n', // Replace existing files if folder is not empty
      windowsHide: true,
      encoding: 'utf-8'
    })

    return output
  })
  plop.setGenerator(Applications.SPA, {
    description: 'Create a new Vue Web SPA',
    prompts: [
      {
        type: 'input',
        name: GeneratorQuestions.NAME,
        message: 'What is the name of a new application?',
        validate: (value?: string) => {
          if (!value?.trim()) {
            return 'Name is required property'
          }

          return true
        }
      },
      {
        type: 'list',
        name: GeneratorQuestions.TS,
        message: 'Add TypeScript?',
        choices: [Answers.NO, Answers.YES]
      },
      {
        type: 'list',
        name: GeneratorQuestions.JSX,
        message: 'Add JSX Support?',
        choices: [Answers.NO, Answers.YES]
      },
      {
        type: 'list',
        name: GeneratorQuestions.ROUTER,
        message: 'Add Vue Router for Single Page Application development?',
        choices: [Answers.NO, Answers.YES]
      },
      {
        type: 'list',
        name: GeneratorQuestions.PINIA,
        message: 'Add Pinia for state management?',
        choices: [Answers.NO, Answers.YES]
      },
      {
        type: 'list',
        name: GeneratorQuestions.VITEST,
        message: 'Add Vitest for Unit Testing?',
        choices: [Answers.NO, Answers.YES]
      },
      {
        type: 'list',
        name: GeneratorQuestions.E2E,
        message: 'Add an End-to-End Testing Solution?',
        choices: [Answers.NO, E2EFrameworks.CYPRESS, E2EFrameworks.NIGHTWATCH, E2EFrameworks.PLAYWRIGHT]
      },
      {
        type: 'list',
        name: GeneratorQuestions.ESLINT,
        message: 'Add ESLint for code quality? ',
        choices: [Answers.NO, Answers.YES]
      },
      {
        type: 'list',
        name: GeneratorQuestions.PRETTIER,
        message: 'Add Prettier for code formatting?',
        choices: [Answers.NO, Answers.YES],
        when: (answers: GeneratorAnswers) => answers?.[GeneratorQuestions.ESLINT] === Answers.YES
      }
    ],
    actions: () => [
      {
        type: 'createVue'
      }
    ]
  })
}
