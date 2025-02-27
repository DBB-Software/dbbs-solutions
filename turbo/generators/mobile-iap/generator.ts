import { type PlopTypes } from '@turbo/gen'
import { AppTypes } from '../mobile-app/config'
import { getAllProjects } from '../utils/getAllProjects'

const GENERATOR_NAME = 'mobile-iap'

function generate(answers: Parameters<PlopTypes.DynamicActionsFunction>[0]) {
  if (!answers) return []
  const projects = getAllProjects()
  const projectPath = projects.find((p) => p.name === answers?.project)?.location
  const basePath = `{{ turbo.paths.root }}/${projectPath}`
  const { appType } = answers

  const actions = [
    {
      type: 'modify',
      path: `${basePath}/package.json`,
      pattern: /"react-native-gesture-handler":\s*".*?"/,
      template: '"react-native-gesture-handler": "2.20.2",\n    "react-native-iap": "12.15.7"'
    },
    {
      type: 'modify',
      path: `${basePath}/package.json`,
      pattern: /"@dbbs\/mobile-firebase":\s*".*?"/,
      template: '"@dbbs/mobile-firebase": "*",\n    "@dbbs/mobile-iap": "*"'
    }
  ]

  if (appType === AppTypes.REACT_NATIVE_CLI) {
    actions.push(
      ...([
        {
          type: 'modify',
          path: `${basePath}/android/app/build.gradle`,
          pattern: /defaultConfig {/,
          template: 'defaultConfig {\n        missingDimensionStrategy "store", "play"'
        },
        {
          type: 'modify',
          path: `${basePath}/android/build.gradle`,
          pattern: /ext {/,
          template: 'ext {\n        androidXAnnotation = "1.1.0"\n        androidXBrowser = "1.0.0"'
        },
        {
          type: 'modify',
          path: `${basePath}/android/app/src/main/AndroidManifest.xml`,
          pattern: /<uses-permission android:name="android.permission.INTERNET" \/>/,
          template:
            '<uses-permission android:name="android.permission.INTERNET" />\n    <uses-permission android:name="com.android.vending.BILLING" />'
        }
      ] satisfies PlopTypes.ActionType[])
    )
  }

  if (appType === AppTypes.EXPO) {
    actions.push(
      {
        type: 'modify',
        path: `${basePath}/extended-expo-plugins.json`,
        pattern: /"iapPluginEnabled":\s*false/,
        template: '"iapPluginEnabled": true'
      },
      {
        type: 'modify',
        path: `${basePath}/app.json`,
        pattern: /"permissions":\s*\[\s*"android.permission.INTERNET"\s*\]/,
        template: '"permissions": ["android.permission.INTERNET", "com.android.vending.BILLING"]'
      }
    )
  }

  return actions
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  const projects = getAllProjects()

  plop.setGenerator(GENERATOR_NAME, {
    description: 'Create a new mobile app',
    prompts: [
      {
        type: 'list',
        name: 'project',
        message: 'Project to add mobile iap into:',
        choices: projects.map((p) => p.name)
      },
      {
        type: 'list',
        name: 'appType',
        message: 'Select select type of your application, which framework you want to use?',
        choices: [AppTypes.REACT_NATIVE_CLI, AppTypes.EXPO]
      }
    ],
    actions: (answers) => [...generate(answers)]
  })
}
