import { type PlopTypes } from '@turbo/gen'
import { execSync } from 'child_process'
import { Storages } from '../mobile-app/config'
import { getAllProjects } from '../utils/getAllProjects'

const generateStorage = (answers: Parameters<PlopTypes.DynamicActionsFunction>[0]): PlopTypes.ActionType[] => {
  if (!answers) return []
  const projects = getAllProjects()
  const projectPath = projects.find((p) => p.name === answers?.project)?.location
  const basePath = `{{ turbo.paths.root }}/${projectPath}`
  const { storage } = answers

  execSync(`cd ${projectPath}`)

  const actions: PlopTypes.ActionType[] = []
  if (storage === Storages.REDUX) {
    actions.push(
      ...([
        {
          type: 'modify',
          path: `${basePath}/src/app/index.tsx`,
          pattern: /import \{ RemoteConfigProvider \} from '@dbbs\/mobile-features'?/,
          template:
            "import { RemoteConfigProvider } from '@dbbs/mobile-features'\nimport { Provider, store } from '@dbbs/mobile-redux-storage'"
        },
        {
          type: 'modify',
          path: `${basePath}/src/app/index.tsx`,
          pattern: /(<PaperProvider theme=\{paperTheme\}>)/,
          template: '<Provider store={store}>\n  $1'
        },
        {
          type: 'modify',
          path: `${basePath}/src/app/index.tsx`,
          pattern: /<\/PaperProvider>/,
          template: '  </PaperProvider>\n</Provider>'
        }
      ] satisfies PlopTypes.ActionType[])
    )
  }
  if (storage === Storages.JOTAI) {
    actions.push(
      ...([
        {
          type: 'modify',
          path: `${basePath}/src/app/index.tsx`,
          pattern: /import React from 'react'/,
          template:
            "import React from 'react'\nimport { Provider } from 'jotai'\nimport { Provider, createStore } from '@dbbs/mobile-jotai-storage'\nconst store = createStore()"
        },
        {
          type: 'modify',
          path: `${basePath}/src/app/index.tsx`,
          pattern: /(<PaperProvider theme=\{paperTheme\}>)/,
          template: '<Provider store={store}>\n  $1'
        },
        {
          type: 'modify',
          path: `${basePath}/src/app/index.tsx`,
          pattern: /<\/PaperProvider>/,
          template: '  </PaperProvider>\n</Provider>'
        }
      ] satisfies PlopTypes.ActionType[])
    )
  }
  return actions
}

export default async function generator(plop: PlopTypes.NodePlopAPI) {
  const projects = getAllProjects()

  plop.setGenerator('mobile-storage', {
    description: 'Add mobile storage to react-native app',
    prompts: [
      {
        type: 'list',
        name: 'project',
        message: 'Project to add storage into:',
        choices: projects.map((p) => p.name)
      },
      {
        type: 'list',
        name: 'storage',
        message: 'Select which storage you want to setup in the project',
        choices: [Storages.REDUX, Storages.JOTAI]
      }
    ],
    actions: (answers) => [...generateStorage(answers)]
  })
}
