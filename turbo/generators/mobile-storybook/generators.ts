import { type PlopTypes } from '@turbo/gen'
import { execSync } from 'child_process'
import path from 'path'
import addPackageJsonScript from '../utils/addPackageJsonScript'
import { getAllProjects } from '../utils/getAllProjects'
import { AppTypes } from '../mobile-app/config'

const packagesToInstall = [
  '@react-native-community/datetimepicker@8.0.1',
  '@react-native-community/slider@4.5.2',
  'react-native-web@0.19.12'
]
const devPackagesToInstall = [
  'storybook@8.1.7',
  '@storybook/addon-actions@8.1.7',
  '@storybook/addon-controls@8.1.7',
  '@storybook/addon-essentials@8.1.7',
  '@storybook/addon-links@8.1.7',
  '@storybook/addon-ondevice-actions@7.6.19',
  '@storybook/addon-ondevice-backgrounds@7.6.19',
  '@storybook/addon-ondevice-controls@7.6.19',
  '@storybook/addon-ondevice-notes@7.6.19',
  '@storybook/addon-react-native-web@0.0.24',
  '@storybook/react@8.1.7',
  '@storybook/react-native@7.6.19',
  '@storybook/react-webpack5@8.1.7',
  'babel-loader@9.1.3',
  'babel-plugin-react-docgen-typescript@1.5.1',
  'babel-plugin-react-native-web@0.19.12',
  'babel-plugin-transform-inline-environment-variables@0.4.4'
]

const addDependencies = (answers: Parameters<PlopTypes.DynamicActionsFunction>[0]) => {
  const projects = getAllProjects()
  const projectPath = projects.find((p) => p.name === answers?.project)?.location

  execSync(`cd ${projectPath} && yarn add ${packagesToInstall.join(' ')}`)
  execSync(`cd ${projectPath} && yarn add -D ${devPackagesToInstall.join(' ')}`)
  if (answers?.appType === AppTypes.REACT_NATIVE_CLI) {
    execSync(`cd ${projectPath} && yarn add -D @babel/preset-react@7.24.7`)
  }
}

const updateStorybookProject = (answers: Parameters<PlopTypes.DynamicActionsFunction>[0]) => {
  const projects = getAllProjects()
  const projectPath = projects.find((p) => p.name === answers?.project)?.location

  execSync(`cd ${path.join(projectPath, 'src')} && mkdir -p stories`)
  addPackageJsonScript(projectPath, { name: 'storybook', content: 'STORYBOOK_ENABLED=true && npx react-native start' })
  addPackageJsonScript(projectPath, { name: 'storybook:web', content: 'storybook dev -p 6006' })
  addPackageJsonScript(projectPath, { name: 'build-storybook', content: 'storybook build' })
  addPackageJsonScript(projectPath, {
    name: 'storybook-generate',
    content: 'sb-rn-get-stories --config-path .ondevice'
  })
  addPackageJsonScript(projectPath, {
    name: 'storybook:ios',
    content: 'STORYBOOK_ENABLED=true && yarn ios:dev'
  })
  addPackageJsonScript(projectPath, {
    name: 'storybook:android',
    content: 'STORYBOOK_ENABLED=true && yarn android:dev'
  })
  addDependencies(answers)

  return 'Project was updated.'
}

const generateStorybook = (answers: Parameters<PlopTypes.DynamicActionsFunction>[0]): PlopTypes.ActionType[] => {
  const projects = getAllProjects()
  const projectPath = projects.find((p) => p.name === answers?.project)?.location
  const basePath = `{{ turbo.paths.root }}/${projectPath}`
  const isExpo = answers?.appType === AppTypes.EXPO
  const isReactNative = answers?.appType === AppTypes.REACT_NATIVE_CLI
  const templateProps = { isExpo, isReactNative }
  execSync(`cd ${projectPath}`)

  return [
    {
      type: 'add',
      path: `${basePath}/.storybook/preview.ts`,
      templateFile: 'storybook/templates/preview.hbs'
    },
    {
      type: 'add',
      path: `${basePath}/.ondevice/index.tsx`,
      templateFile: 'mobile-app/templates/.ondevice/index.hbs'
    },
    {
      type: 'add',
      path: `${basePath}/.ondevice/main.ts`,
      templateFile: 'mobile-app/templates/.ondevice/main.hbs'
    },
    {
      type: 'add',
      path: `${basePath}/.ondevice/preview.tsx`,
      templateFile: 'mobile-app/templates/.ondevice/preview.hbs'
    },
    {
      type: 'add',
      path: `${basePath}/.storybook/main.tsx`,
      templateFile: 'mobile-app/templates/.ondevice/main.hbs'
    },
    {
      type: 'add',
      path: `${basePath}/.storybook/preview.tsx`,
      templateFile: 'mobile-app/templates/.ondevice/preview.hbs'
    },
    {
      type: 'add',
      path: `${basePath}/AppEntryPoint.tsx`,
      templateFile: 'mobile-app/templates/AppEntryPoint.hbs',
      data: templateProps
    },
    {
      type: 'updateStorybookProject'
    }
  ]
}

export default async function generator(plop: PlopTypes.NodePlopAPI) {
  const projects = getAllProjects()

  plop.setActionType('updateStorybookProject', (answers) =>
    updateStorybookProject(answers as Parameters<PlopTypes.DynamicActionsFunction>[0])
  )

  plop.setGenerator('mobile-storybook', {
    description: 'Add mobile storybook to the react-native app',
    prompts: [
      {
        type: 'list',
        name: 'project',
        message: 'Project to add storybook into:',
        choices: projects.map((p) => p.name)
      },
      {
        type: 'list',
        name: 'appType',
        message: 'Select select type of your application, which framework you want to use?',
        choices: [AppTypes.REACT_NATIVE_CLI, AppTypes.EXPO]
      }
    ],
    actions: (answers) => [...generateStorybook(answers)]
  })
}
