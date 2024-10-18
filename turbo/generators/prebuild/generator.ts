import path from 'path'
import { execSync } from 'child_process'
import { type PlopTypes } from '@turbo/gen'

const PREBUILD_CLEANUP = 'PREBUILD_CLEANUP'
const EXPO_PREBUILD = 'expo-prebuild'

const validator = (value: string, massage: string) => {
  if (!value?.trim()) {
    return massage
  }

  return true
}

function prebuildCleanup(answers?: Parameters<PlopTypes.DynamicActionsFunction>[0]) {
  if (!answers) return 'Missing answers'

  const workspace = answers.name.replace(/\s+/g, '')
  const workspaceRoot = path.resolve(__dirname, '..', '..', '..', 'typescript', 'apps', answers.folder)
  const androidRoot = path.resolve(workspaceRoot, 'android')
  const iosRoot = path.resolve(workspaceRoot, 'ios')

  try {
    // Use jq for safe removal of the redundant dependency
    execSync(
      `cd ${workspaceRoot} && jq 'del(.dependencies.react)' package.json > temp.json && mv temp.json package.json`
    )
    // Remove redundant files for android and ios
    execSync(`find ${androidRoot} ${iosRoot} -type f -name ".gitignore" -exec rm {} \\; || true`)
    execSync(`find ${androidRoot}/app/src/androidTest/java/com -type f -name "DetoxTest.java" -exec rm {} \\; || true`)
    execSync(
      `find ${iosRoot}/${workspace}.xcodeproj/xcshareddata/xcschemes -type f -name "${workspace}.xcscheme" -exec rm {} \\; || true`
    )
    // Install fresh cocoapods
    execSync(`cd ${iosRoot} && pod install`)
    return 'Success'
  } catch {
    return 'Error'
  }
}

function generate(answers?: Parameters<PlopTypes.DynamicActionsFunction>[0]) {
  if (!answers) return []

  const { folder, name, appNameProd, appNameDev, appId } = answers
  const workspace = name.replace(/\s+/g, '')
  const androidProject = appId?.split('.').join('/')

  const workspaceRoot = path.resolve(__dirname, '..', '..', '..', 'typescript', 'apps', folder)
  const androidRoot = path.resolve(workspaceRoot, 'android')
  const iosRoot = path.resolve(workspaceRoot, 'ios')

  return [
    {
      type: 'add',
      path: `${iosRoot}/${workspace}.xcodeproj/xcshareddata/xcschemes/${workspace} Dev.xcscheme`,
      templateFile: 'prebuild/templates/Scheme.hbs',
      data: {
        workspace,
        appName: appNameDev
      }
    },
    {
      type: 'add',
      path: `${iosRoot}/${workspace}.xcodeproj/xcshareddata/xcschemes/${workspace} Prod.xcscheme`,
      templateFile: 'prebuild/templates/Scheme.hbs',
      data: {
        workspace,
        appName: appNameProd
      }
    },
    {
      type: 'modify',
      path: `${iosRoot}/${workspace}/Info.plist`,
      pattern: /<key>CFBundleDisplayName<\/key>\s*<string>(.*?)<\/string>/,
      template: `<key>CFBundleDisplayName</key>\n    <string>${appNameProd}</string>`
    },
    {
      type: 'add',
      path: `${androidRoot}/app/src/androidTest/java/${androidProject}/DetoxTest.kt`,
      templateFile: 'prebuild/templates/DetoxTest.hbs',
      data: {
        package: appId
      }
    },
    {
      type: 'modify',
      path: `${androidRoot}/app/build.gradle`,
      pattern: /(compileSdk rootProject.ext.compileSdkVersion)/g,
      template: '$1\n    flavorDimensions "default"'
    },
    {
      type: 'modify',
      path: `${androidRoot}/app/build.gradle`,
      pattern:
        /(signingConfigs \{\n {8}debug \{\n {12}storeFile file\('debug.keystore'\)\n {12}storePassword 'android'\n {12}keyAlias 'androiddebugkey'\n {12}keyPassword 'android'\n {8}\}\n {4}\})/g,
      template: `$1
    productFlavors {
        prod {
            resValue "string", "app_name", "${appNameProd}"
        }
        dev {
            resValue "string", "app_name", "${appNameDev}"
        }
    }`
    }
  ]
}

export default function expoPrebuildGenerator(plop: PlopTypes.NodePlopAPI): void {
  plop.setActionType(PREBUILD_CLEANUP, (answers) => prebuildCleanup(answers))
  plop.setGenerator(EXPO_PREBUILD, {
    description: 'Prebuild for expo native part',
    prompts: [
      {
        type: 'input',
        name: 'folder',
        message: 'What is the folder name of your Expo app?',
        validate: (value) => validator(value, 'folder is required property')
      },
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of workspace for your Expo app?',
        validate: (value) => validator(value, 'Name is required property')
      },
      {
        type: 'input',
        name: 'appNameProd',
        message: 'What is the app name of your Expo app prod variant?',
        validate: (value) => validator(value, 'appName is required property')
      },
      {
        type: 'input',
        name: 'appNameDev',
        message: 'What is the app name of your Expo app dev variant?',
        validate: (value) => validator(value, 'appNameDev is required property')
      },
      {
        type: 'input',
        name: 'appId',
        message: 'What is the app id of your Expo app?',
        validate: (value) => validator(value, 'appNameDev is required property')
      }
    ],
    actions: (answers) => [{ type: PREBUILD_CLEANUP }, ...generate(answers)]
  })
}
