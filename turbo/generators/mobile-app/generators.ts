import path from 'path'
import { type PlopTypes } from '@turbo/gen'
import { execSync } from 'child_process'
import { generateAndroid, generateFastlane, generateIos, generateRN } from './scripts'
import { AppTypes, Storages, SUPPORTED_RN_VERSION } from './config'

const GENERATOR_NAME = 'mobile-app'
const GENERATE_TEMPLATE = 'GENERATE_TEMPLATE'

const getInheritedExec = (command: string) => execSync(command, { stdio: 'inherit' })

const generateBaseRNTemplateAction: PlopTypes.CustomActionFunction = (
  answers: Parameters<PlopTypes.DynamicActionsFunction>[0]
) => {
  const foldername = answers?.name
  const appType = answers?.appType
  const currentDirectory = process.cwd()
  const projectPath = path.resolve(currentDirectory, 'typescript', 'apps', foldername)

  if (appType === AppTypes.REACT_NATIVE_CLI) {
    getInheritedExec(
      `
      # Navigate to the project directory
      cd typescript/apps && echo 'y' | npx react-native init ${foldername} --version ${SUPPORTED_RN_VERSION} --skip-install &&
    
      # Move into the newly created project and remove unnecessary files and folders
      cd ${projectPath} && rm -rf node_modules __tests__ .gitignore Gemfile *.js *.tsx *.json *.md .eslintrc.js .prettierrc.js &&
    
      # Remove files in the Android directory if they exist
      cd ${projectPath}/android && rm -rf build.gradle settings.gradle app/build.gradle app/src/main/AndroidManifest.xml app/src/main/java/com/${foldername.toLowerCase()}/{MainActivity.kt,MainApplication.kt} &&
    
      # Now, navigate to the iOS directory and remove files and folders for iOS
      cd ${projectPath}/ios && rm -rf Podfile ${foldername}/{AppDelegate.mm,Info.plist,${foldername}.entitlements} ${foldername}/Images.xcassets/AppIcon.appiconset &&
      
      # Remove the Xcode project scheme
      rm -rf ${projectPath}/ios/${foldername}.xcodeproj/xcshareddata/xcschemes/${foldername}.xcscheme &&

      # Copy the iOS app icons
      cp -R ${currentDirectory}/turbo/generators/mobile-app/templates/react-native-cli/ios/AppIcon.appiconset ${projectPath}/ios/${foldername}/Images.xcassets
      `
    )
  } else {
    getInheritedExec(`mkdir -p ${projectPath}/assets`)
    getInheritedExec(
      `
      cp -R turbo/generators/mobile-app/templates/expo/{assets/*,.expo-shared} ${projectPath}/assets
      `
    )
  }
  getInheritedExec(`mkdir -p ${projectPath}/fastlane`)

  return GENERATE_TEMPLATE
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setActionType(GENERATE_TEMPLATE, (answers) => {
    generateBaseRNTemplateAction(answers)

    return GENERATE_TEMPLATE
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
        type: 'confirm',
        name: 'iap',
        message: 'Select whether you want to setup mobile in-app purchase in the project'
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
      ...generateFastlane(answers)
    ]
  })
}
