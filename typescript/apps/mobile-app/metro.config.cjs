const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const { getMetroTools, getMetroAndroidAssetsResolutionFix } = require('react-native-monorepo-tools')
const { generate } = require('@storybook/react-native/scripts/generate')
const exclusionList = require('metro-config/src/defaults/exclusionList')
const { withSentryConfig } = require("@sentry/react-native/metro")
const path = require('path')

generate({
  configPath: path.resolve(__dirname, './.ondevice'),
});

const monorepoMetroTools = getMetroTools()

const androidAssetsResolutionFix = getMetroAndroidAssetsResolutionFix()

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    // Apply the Android assets resolution fix to the public path...
    publicPath: androidAssetsResolutionFix.publicPath,
    unstable_allowRequireContext: true,
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false
      }
    })
  },
  server: {
    // ...and to the server middleware.
    enhanceMiddleware: (middleware) => {
      return androidAssetsResolutionFix.applyMiddleware(middleware)
    }
  },
  // Add additional Yarn workspace package roots to the module map.
  // This allows importing importing from all the project's packages.
  watchFolders: monorepoMetroTools.watchFolders,
  resolver: {
    // Ensure we resolve nohoist libraries from this directory.
    blockList: exclusionList(monorepoMetroTools.blockList),
    extraNodeModules: monorepoMetroTools.extraNodeModules,
    resolveRequest: (context, moduleName, platform) => {
      const defaultResolveResult = context.resolveRequest(
        context,
        moduleName,
        platform
      );

      if (
        process.env.STORYBOOK_ENABLED !== 'true' &&
        defaultResolveResult?.filePath?.includes?.('.ondevice/')
      ) {
        return {
          type: 'empty',
        };
      }

      return defaultResolveResult;
    },
  }
}

module.exports = withSentryConfig(mergeConfig(getDefaultConfig(__dirname), config))
