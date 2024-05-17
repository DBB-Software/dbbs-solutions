import { type PlopTypes } from '@turbo/gen'
import { execSync } from 'child_process'
import path from 'path'
import addPackageJsonScript from '../utils/addPackageJsonScript'

enum StorybookFrameworks {
  NextJS = 'nextjs',
  React = 'react'
}

const baseStorybookPackages = [
  'storybook@8.0.8',
  '@storybook/test@8.0.8',
  '@storybook/react@8.0.8',
  '@storybook/blocks@8.0.8',
  '@storybook/addon-links@8.0.8',
  '@storybook/addon-interactions@8.0.8',
  '@storybook/addon-essentials@8.0.8'
]

const nextjsStorybookPackages = ['@storybook/nextjs@8.0.8']

const getAllProjects = () => {
  try {
    const projectsNDJSON = execSync('yarn workspaces list --json').toString()
    const projects = projectsNDJSON
      .split(/\r?\n/)
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line))

    return projects
  } catch (_e) {
    return []
  }
}

const addDependencies = (answers: Parameters<PlopTypes.DynamicActionsFunction>[0]): PlopTypes.ActionType[] => {
  const projects = getAllProjects()
  const projectPath = projects.find((p) => p.name === answers?.project)?.location

  const packagesToInstall = [
    ...baseStorybookPackages,
    ...(answers?.framework === StorybookFrameworks.NextJS ? nextjsStorybookPackages : [])
  ]

  execSync(`cd ${projectPath} && yarn add -D ${packagesToInstall.join(' ')}`)
}

const updateStorybookProject = (answers: Parameters<PlopTypes.DynamicActionsFunction>[0]) => {
  const projects = getAllProjects()
  const projectPath = projects.find((p) => p.name === answers?.project)?.location

  execSync(`cd ${path.join(projectPath, 'src')} && mkdir -p stories`)
  addPackageJsonScript(projectPath, { name: 'storybook', content: 'storybook dev -p 6006' })
  addDependencies(answers)

  return 'Project was updated.'
}

const generateStorybook = (answers: Parameters<PlopTypes.DynamicActionsFunction>[0]): PlopTypes.ActionType[] => {
  const projects = getAllProjects()
  const projectPath = projects.find((p) => p.name === answers?.project)?.location
  const basePath = `{{ turbo.paths.root }}/${projectPath}`

  execSync(`cd ${projectPath}`)

  const actions: PlopTypes.ActionType[] = [
    {
      type: 'add',
      path: `${basePath}/.storybook/preview.ts`,
      templateFile: 'storybook/templates/preview.hbs'
    },
    {
      type: 'updateStorybookProject'
    }
  ]

  if (answers?.framework === StorybookFrameworks.React) {
    actions.push({
      type: 'add',
      path: `${basePath}/.storybook/main.ts`,
      templateFile: 'storybook/templates/main-react.hbs'
    })
  }

  if (answers?.framework === StorybookFrameworks.NextJS) {
    actions.push({
      type: 'add',
      path: `${basePath}/.storybook/main.ts`,
      templateFile: 'storybook/templates/main-next.hbs'
    })
  }

  return actions
}

export default async function generator(plop: PlopTypes.NodePlopAPI) {
  const projects = getAllProjects()

  plop.setActionType('updateStorybookProject', (answers) =>
    updateStorybookProject(answers as Parameters<PlopTypes.DynamicActionsFunction>[0])
  )

  plop.setGenerator('storybook', {
    description: 'Add storybook to the app or package',
    prompts: [
      {
        type: 'list',
        name: 'framework',
        message: 'Choose framework what are you using:',
        choices: [StorybookFrameworks.React, StorybookFrameworks.NextJS]
      },
      {
        type: 'list',
        name: 'project',
        message: 'Project to add storybook into:',
        choices: projects.map((p) => p.name)
      }
    ],
    actions: (answers) => [...generateStorybook(answers)]
  })
}
