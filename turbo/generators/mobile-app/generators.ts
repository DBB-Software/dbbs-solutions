import { type PlopTypes } from '@turbo/gen'
import { execSync } from 'child_process'
import { generateAndroid, generateExpoOverrides, generateFastlane, generateIos, generateRN } from './scripts'
import { AppTypes, Storages } from './config'

const GENERATOR_NAME = 'mobile-app'
const GENERATE_TEMPLATE = 'GENERATE_TEMPLATE'
const EXPO_PREBUILD = 'EXPO_PREBUILD'

const generateBaseRNTemplateAction: PlopTypes.CustomActionFunction = (
  answers: Parameters<PlopTypes.DynamicActionsFunction>[0]
) => {
  const foldername = answers?.name
  const appType = answers?.appType
  const currentDirectory = process.cwd()

  if (appType === AppTypes.REACT_NATIVE_CLI) {
    execSync(`
      cd apps && npx react-native init ${foldername} &&
      cd ${foldername} && rm -rf node_modules __tests__ .gitignore Gemfile *.js *.tsx *.json *.md .eslintrc.js .prettierrc.js &&
      cd android && rm -rf build.gradle && cd app && rm -rf build.gradle && cd src/main && rm -rf AndroidManifest.xml && cd ../../../.. &&
      cd ios && rm -rf Podfile && cd ${foldername} && rm -rf AppDelegate.mm && rm -rf Info.plist ${foldername}.entitlements && cd Images.xcassets && rm -rf AppIcon.appiconset && cd ../../.. &&
      cd ios/${foldername}.xcodeproj/xcshareddata/xcschemes && rm -rf ${foldername}.xcscheme && cd ../../../../../../ &&
      cp -R turbo/generators/mobile-app/templates/ios/AppIcon.appiconset apps/${foldername}/ios/${foldername}/Images.xcassets
      `)
  } else {
    execSync(`mkdir -p ${currentDirectory}/apps/${foldername}/assets`)
    execSync(`
      cp -R turbo/generators/mobile-app/templates/expo/assets/* ${currentDirectory}/apps/${foldername}/assets &&
      cp -R turbo/generators/mobile-app/templates/expo/.expo-shared ${currentDirectory}/apps/${foldername} &&
      cp -R turbo/generators/mobile-app/templates/expo/firebase ${currentDirectory}/apps/${foldername}
      `)
  }
  execSync(`mkdir -p ${currentDirectory}/apps/${foldername}/fastlane`)

  return GENERATE_TEMPLATE
}

const expoPrebuild = (answers: Parameters<PlopTypes.DynamicActionsFunction>[0]) => {
  const foldername = answers?.name

  execSync(`cd apps/${foldername} && yarn && yarn prebuild`)

  return EXPO_PREBUILD
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setActionType(GENERATE_TEMPLATE, (answers) => {
    generateBaseRNTemplateAction(answers)

    return GENERATE_TEMPLATE
  })
  plop.setActionType(EXPO_PREBUILD, (answers) => {
    expoPrebuild(answers)

    return EXPO_PREBUILD
  })
  plop.setGenerator(GENERATOR_NAME, {
    description: 'Create a new mobile app',
    prompts: [
      {
        type: 'list',
        name: 'appType',
        message: 'Select select type of your application, which framework you want to use?',
        choices: [AppTypes.REACT_NATIVE_CLI, AppTypes.EXPO]
      },
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
      },
      {
        type: 'confirm',
        name: 'storybook',
        message: 'Select whether you want to setup storybook in the project'
      },
      {
        type: 'list',
        name: 'storage',
        message: 'Select whether you want to setup storage in the project, or not',
        choices: [Storages.REDUX, Storages.JOTAI, Storages.NONE]
      },
      {
        type: 'list',
        name: 'info',
        message:
          'Please ensure you have created `google-services.json` for Android and `GoogleService-Info.plist` for iOS in Firebase. These files are required for the app to build.',
        choices: ["I've read the information, continue"]
      }
    ],
    actions: (answers) => [
      { type: GENERATE_TEMPLATE },
      ...generateRN(answers),
      ...(answers?.appType === AppTypes.REACT_NATIVE_CLI ? [...generateAndroid(answers), ...generateIos(answers)] : []),
      ...(answers?.appType === AppTypes.EXPO ? [{ type: EXPO_PREBUILD }, ...generateExpoOverrides(answers)] : []),
      ...generateFastlane(answers)
    ]
  })
}
