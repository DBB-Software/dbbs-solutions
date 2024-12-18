import { type PlopTypes } from '@turbo/gen'

export const generateIos = (answers: Parameters<PlopTypes.DynamicActionsFunction>[0]) => {
  if (!answers) return []

  const appName = answers.name
  const appNameInLowerCase = answers.name.toLowerCase()
  const templateProps = { appNameInLowerCase, appName }

  const pathToReactNativeScripts = /\.\.\/node_modules\/react-native\/scripts\//gi
  const bundleReactNativeCodeImages = /00DD1BFF1BD5951E006B06BC \/\* Bundle React Native code and images \*\//
  const pbxShellScriptBuildPhaseSection = /\/\* Begin PBXShellScriptBuildPhase section \*\//
  const shellScriptToChange =
    /00DD1BFF1BD5951E006B06BC \/\* Bundle React Native code and images \*\/ = \{\s*isa = PBXShellScriptBuildPhase;[\s\S]*?shellScript = "set -e[\s\S]*?";\s*\};/

  return [
    {
      type: 'modify',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/ios/${appName}.xcodeproj/project.pbxproj`,
      pattern: pathToReactNativeScripts,
      template: '../../../node_modules/react-native/scripts/'
    },
    {
      type: 'modify',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/ios/${appName}.xcodeproj/project.pbxproj`,
      pattern: bundleReactNativeCodeImages,
      template:
        '00DD1BFF1BD5951E006B06BC /* Bundle React Native code and images */,\n\t\t\t\t0086D6742C59660A00DEDCE0 /* Upload Debug Symbols to Sentry */'
    },
    {
      type: 'modify',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/ios/${appName}.xcodeproj/project.pbxproj`,
      pattern: pbxShellScriptBuildPhaseSection,
      template: `/* Begin PBXShellScriptBuildPhase section */
		0086D6742C59660A00DEDCE0 /* Upload Debug Symbols to Sentry */ = {
			isa = PBXShellScriptBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			inputFileListPaths = (
			);
			inputPaths = (
			);
			name = "Upload Debug Symbols to Sentry";
			outputFileListPaths = (
			);
			outputPaths = (
			);
			runOnlyForDeploymentPostprocessing = 0;
			shellPath = /bin/sh;
			shellScript = "# Type a script or drag a script file from your workspace to insert its path.\\n/bin/sh ../../../../node_modules/@sentry/react-native/scripts/sentry-xcode-debug-files.sh\\n";
		};`
    },
    {
      type: 'modify',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/ios/${appName}.xcodeproj/project.pbxproj`,
      pattern: shellScriptToChange,
      template: `00DD1BFF1BD5951E006B06BC /* Bundle React Native code and images */ = {
			isa = PBXShellScriptBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			inputPaths = (
				"$(SRCROOT)/.xcode.env.local",
				"$(SRCROOT)/.xcode.env",
			);
			name = "Bundle React Native code and images";
			outputPaths = (
			);
			runOnlyForDeploymentPostprocessing = 0;
			shellPath = /bin/sh;
			shellScript = "set -e\\n\\nWITH_ENVIRONMENT=\\"../../../../node_modules/react-native/scripts/xcode/with-environment.sh\\"\\nREACT_NATIVE_XCODE=\\"../../../../node_modules/react-native/scripts/react-native-xcode.sh\\"\\nSENTRY_XCODE=\\"../../../../node_modules/@sentry/react-native/scripts/sentry-xcode.sh\\"\\nBUNDLE_REACT_NATIVE=\\"/bin/sh $SENTRY_XCODE $REACT_NATIVE_XCODE\\"\\n\\n/bin/sh -c \\"$WITH_ENVIRONMENT \\\\\\"$BUNDLE_REACT_NATIVE\\"\\n";\n    };`
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/ios/${appName}/Info.plist`,
      templateFile: 'mobile-app/templates/react-native-cli/ios/Info-plist.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/ios/${appName}/${appName}.entitlements`,
      templateFile: 'mobile-app/templates/react-native-cli/ios/Entitlements.hbs'
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/ios/${appName}.xcodeproj/xcshareddata/xcschemes/${appName} Prod.xcscheme`,
      templateFile: 'mobile-app/templates/react-native-cli/ios/MobileApp Prod.xcscheme.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/ios/${appName}.xcodeproj/xcshareddata/xcschemes/${appName} Dev.xcscheme`,
      templateFile: 'mobile-app/templates/react-native-cli/ios/MobileApp Dev.xcscheme.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/ios/${appName}/AppDelegate.mm`,
      templateFile: 'mobile-app/templates/react-native-cli/ios/AppDelegate.hbs',
      data: templateProps
    },
    {
      type: 'add',
      path: `{{ turbo.paths.root }}/typescript/apps/${appName}/ios/Podfile`,
      templateFile: 'mobile-app/templates/react-native-cli/ios/Podfile.hbs',
      data: templateProps
    }
  ]
}
