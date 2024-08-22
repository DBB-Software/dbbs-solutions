const path = require("path")
const { getSentryExpoConfig } = require("@sentry/react-native/metro")
const { generate } = require("@storybook/react-native/scripts/generate")

// Find the project and workspace directories
const projectRoot = __dirname
// This can be replaced with `find-yarn-workspace-root`
const monorepoRoot = path.resolve(projectRoot, '../..')

const config = getSentryExpoConfig(projectRoot)

generate({
  configPath: path.resolve(__dirname, "./.ondevice"),
})

// 1. Watch all files within the monorepo
config.watchFolders = [monorepoRoot]
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
]

config.transformer.unstable_allowRequireContext = true
config.resolver.disableHierarchicalLookup = true;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const defaultResolveResult = context.resolveRequest(
    context,
    moduleName,
    platform
  )

  if (
    process.env.STORYBOOK_ENABLED !== "true" &&
    defaultResolveResult?.filePath?.includes?.(".ondevice/")
  ) {
    return {
      type: "empty",
    }
  }

  return defaultResolveResult
}

module.exports = config