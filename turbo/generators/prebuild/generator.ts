/* eslint-disable no-template-curly-in-string */
import path from 'path'
import { execSync } from 'child_process'
import { type PlopTypes } from '@turbo/gen'

const PREBUILD_CLEANUP = 'PREBUILD_CLEANUP'
const INSTALL_DEPS = 'INSTALL_DEPS'
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

    return 'Success'
  } catch {
    return 'Error'
  }
}

function installDependencies(answers?: Parameters<PlopTypes.DynamicActionsFunction>[0]) {
  if (!answers) return 'Missing answers'

  const workspaceRoot = path.resolve(__dirname, '..', '..', '..', 'typescript', 'apps', answers.folder)
  const iosRoot = path.resolve(workspaceRoot, 'ios')

  try {
    execSync(`cd ${workspaceRoot} && yarn`, { stdio: 'inherit' })
  } catch (error) {
    console.error(error)
  }

  try {
    execSync(`cd ${iosRoot} && pod install`, { stdio: 'inherit' })
  } catch (error) {
    console.error(error)
  }

  return 'Success'
}

function generate(answers?: Parameters<PlopTypes.DynamicActionsFunction>[0]) {
  if (!answers) return []

  const { folder, name, appNameProd, appNameDev, appId, isIapPluginEnabled, isIapPresentInPackageJson } = answers
  const workspace = name.replace(/\s+/g, '')
  const androidProject = appId?.split('.').join('/')

  const workspaceRoot = path.resolve(__dirname, '..', '..', '..', 'typescript', 'apps', folder)
  const androidRoot = path.resolve(workspaceRoot, 'android')
  const iosRoot = path.resolve(workspaceRoot, 'ios')
  const isIAPEnabled = isIapPluginEnabled === 'y'

  const actions = [
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
      type: 'modify',
      path: `${iosRoot}/${workspace}/Info.plist`,
      pattern:
        /<dict>\s*<key>CFBundleURLSchemes<\/key>\s*<array>\s*<string>exp\+mobile-expo-app<\/string>\s*<\/array>\s*<\/dict>/,
      template:
        '<dict>\n        <key>CFBundleURLSchemes</key>\n        <array>\n          <string>exp+mobile-expo-app</string>\n        </array>\n      </dict>\n      <dict>\n        <key>CFBundleTypeRole</key>\n        <string>Editor</string>\n        <key>CFBundleURLName</key>\n        <string>io.Branch.Branchsters</string>\n        <key>CFBundleURLSchemes</key>\n        <array>\n          <string>branchsters</string>\n        </array>\n      </dict>\n      <dict>\n        <key>CFBundleURLSchemes</key>\n        <array>\n          <string>$(BRANCH_URL_SCHEME)</string>\n        </array>\n      </dict>'
    },
    {
      type: 'modify',
      path: `${iosRoot}/${workspace}/Info.plist`,
      pattern: /<key>UIViewControllerBasedStatusBarAppearance<\/key>\s*<false\/>/,
      template:
        '<key>UIViewControllerBasedStatusBarAppearance</key>\n    <false/>\n    <key>branch_key</key>\n    <dict>\n      <key>live</key>\n      <string>$(BRANCH_KEY)</string>\n    </dict>\n    <key>branch_universal_link_domains</key>\n    <array>\n      <string>$(BRANCH_MAIN_LINK)</string>\n      <string>$(BRANCH_ALTERNATE_LINK)</string>\n    </array>'
    },
    {
      type: 'modify',
      path: `${iosRoot}/${workspace}/AppDelegate.mm`,
      pattern: /#import\s+<Firebase\/Firebase\.h>\s*/,
      template: '#import <Firebase/Firebase.h>\n#import <RNBranch/RNBranch.h>\n\n'
    },
    {
      type: 'modify',
      path: `${iosRoot}/${workspace}/AppDelegate.mm`,
      pattern: /\[FIRApp\s+configure\];/,
      template: `[FIRApp configure];
[RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];
NSURL *jsCodeLocation;`
    },
    {
      type: 'modify',
      path: `${iosRoot}/${workspace}/AppDelegate.mm`,
      pattern:
        /return \[super application:application openURL:url options:options\] \|\| \[RCTLinkingManager application:application openURL:url options:options\];/,
      template:
        'return [RNBranch openURL:url options:options] || [RCTLinkingManager application:application openURL:url options:options];'
    },
    {
      type: 'modify',
      path: `${iosRoot}/${workspace}/AppDelegate.mm`,
      pattern: /super\s+application:application\s+continueUserActivity/,
      template: 'RNBranch continueUserActivity'
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
      path: `${androidRoot}/app/src/main/java/${androidProject}/MainActivity.kt`,
      pattern: /import\s+expo\.modules\.ReactActivityDelegateWrapper/,
      template: `import expo.modules.ReactActivityDelegateWrapper
import io.branch.rnbranch.*
import android.content.Intent`
    },
    {
      type: 'modify',
      path: `${androidRoot}/app/src/main/java/${androidProject}/MainActivity.kt`,
      pattern: /super\.onCreate\(null\)\s*}/,
      template: `super.onCreate(null)
  }
  override fun onStart() {
      super.onStart()
      RNBranchModule.initSession(getIntent().getData(), this)
  }

  override fun onNewIntent(intent: Intent?) {
    super.onNewIntent(intent)
    setIntent(intent)
    RNBranchModule.reInitSession(this)
  }`
    },
    {
      type: 'modify',
      path: `${androidRoot}/app/src/main/java/${androidProject}/MainApplication.kt`,
      pattern: /import\s+com\.facebook\.soloader\.SoLoader\s*\n/,
      template: `import com.facebook.soloader.SoLoader
import io.branch.rnbranch.*\n\n`
    },
    {
      type: 'modify',
      path: `${androidRoot}/app/src/main/java/${androidProject}/MainApplication.kt`,
      pattern: /super\.onCreate\(\)/,
      template: `super.onCreate()
    RNBranchModule.getAutoInstance(this)
    RNBranchModule.enableLogging()`
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
            manifestPlaceholders = [
                branchTestMode: "false",
                branchURLScheme: System.getenv("BRANCH_URL_SCHEME"),
                branchMainLink: System.getenv("BRANCH_MAIN_LINK"),
                branchAlternateLink: System.getenv("BRANCH_ALTERNATE_LINK"),
                branchKeyLive: System.getenv("BRANCH_KEY"),
                branchKeyTest: System.getenv("BRANCH_KEY")
            ]
        }
        dev {
            resValue "string", "app_name", "${appNameDev}"
            manifestPlaceholders = [
                branchTestMode: "true",
                branchURLScheme: System.getenv("BRANCH_URL_SCHEME"),
                branchMainLink: System.getenv("BRANCH_MAIN_LINK"),
                branchAlternateLink: System.getenv("BRANCH_ALTERNATE_LINK"),
                branchKeyLive: System.getenv("BRANCH_KEY"),
                branchKeyTest: System.getenv("BRANCH_KEY")
            ]
        }
    }`
    },
    {
      type: 'modify',
      path: `${androidRoot}/app/build.gradle`,
      pattern: /\/\/\s*The version of react-native is set by the React Native Gradle Plugin/,
      template: `implementation('io.branch.sdk.android:library:5.13.0')
    implementation ('com.google.android.gms:play-services-ads-identifier:18.0.1')
    // Alternatively, use the following lib for getting the AAID:
    // implementation ('com.google.android.gms:play-services-ads:17.2.0')
    implementation('com.facebook.react:react-android')`
    },
    {
      type: 'modify',
      path: `${androidRoot}/app/src/main/AndroidManifest.xml`,
      pattern:
        /<meta-data\s+android:name="expo\.modules\.updates\.EXPO_UPDATES_LAUNCH_WAIT_MS"\s+android:value="0"\s*\/>/,
      template:
        '<meta-data android:name="expo.modules.updates.EXPO_UPDATES_LAUNCH_WAIT_MS" android:value="0"/>\n    <meta-data android:name="io.branch.sdk.BranchKey" android:value="${branchKeyLive}" />\n    <meta-data android:name="io.branch.sdk.BranchKey.test" android:value="${branchKeyTest}" />\n    <meta-data android:name="io.branch.sdk.TestMode" android:value="${branchTestMode}" />'
    },
    {
      type: 'modify',
      path: `${androidRoot}/app/src/main/AndroidManifest.xml`,
      pattern: /<\/intent-filter>/,
      template:
        '</intent-filter>\n      <intent-filter>\n        <data android:scheme="${branchURLScheme}" android:host="open" />\n        <action android:name="android.intent.action.VIEW" />\n        <category android:name="android.intent.category.DEFAULT" />\n        <category android:name="android.intent.category.BROWSABLE" />\n      </intent-filter>\n      <intent-filter android:autoVerify="true">\n        <action android:name="android.intent.action.VIEW" />\n        <category android:name="android.intent.category.DEFAULT" />\n        <category android:name="android.intent.category.BROWSABLE" />\n        <data android:scheme="https" android:host="${branchMainLink}" />\n        <data android:scheme="https" android:host="${branchAlternateLink}" />\n      </intent-filter>'
    },
    {
      type: 'modify',
      path: `${androidRoot}/app/src/main/AndroidManifest.xml`,
      pattern: /<\/application>/,
      template:
        '</application>\n  <queries>\n    <intent>\n      <action android:name="android.intent.action.SEND" />\n      <data android:mimeType="text/plain" />\n    </intent>\n  </queries>'
    }
  ]

  if (isIAPEnabled) {
    actions.push(
      ...([
        {
          type: 'modify',
          path: `${androidRoot}/app/build.gradle`,
          pattern: /defaultConfig {/,
          template: 'defaultConfig {\n        missingDimensionStrategy "store", "play"'
        },
        {
          type: 'modify',
          path: `${androidRoot}/build.gradle`,
          pattern: /ext {/,
          template: 'ext {\n        androidXAnnotation = "1.1.0"\n        androidXBrowser = "1.0.0"'
        },
        {
          type: 'modify',
          path: `${androidRoot}/gradle.properties`,
          pattern: /android\.extraMavenRepos\s*=\s*\[\s*\]/,
          template: 'android.extraMavenRepos=[]\nandroid.minSdkVersion=24'
        }
      ] satisfies PlopTypes.ActionType[])
    )
  }

  if (isIapPresentInPackageJson === 'n') {
    actions.push(
      ...([
        {
          type: 'modify',
          path: `${workspaceRoot}/package.json`,
          pattern: /"react-native-gesture-handler":\s*".*?"/,
          template: '"react-native-gesture-handler": "2.20.2",\n    "react-native-iap": "12.15.7"'
        },
        {
          type: 'modify',
          path: `${workspaceRoot}/package.json`,
          pattern: /"@dbbs\/mobile-firebase":\s*".*?"/,
          template: '"@dbbs/mobile-firebase": "*",\n    "@dbbs/mobile-iap": "*"'
        }
      ] satisfies PlopTypes.ActionType[])
    )
  }

  return actions
}

export default function expoPrebuildGenerator(plop: PlopTypes.NodePlopAPI): void {
  plop.setActionType(PREBUILD_CLEANUP, (answers) => prebuildCleanup(answers))
  plop.setActionType(INSTALL_DEPS, (answers) => installDependencies(answers))
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
      },
      {
        type: 'input',
        name: 'isIapPluginEnabled',
        message: 'Do you want to add package react-native-iap dependencies? (yes/no):',
        validate: (value) => validator(value, 'isIapPluginEnabled is required property')
      },
      {
        type: 'input',
        name: 'isIapPresentInPackageJson',
        message: 'Do you want to add package @dbbs/mobile-iap package to package.json? (yes/no):',
        validate: (value) => validator(value, 'isIapPresentInPackageJson is required property')
      }
    ],
    actions: (answers) => [{ type: PREBUILD_CLEANUP }, ...generate(answers), { type: INSTALL_DEPS }]
  })
}
