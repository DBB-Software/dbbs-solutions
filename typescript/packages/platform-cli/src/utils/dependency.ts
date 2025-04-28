import path from 'path'
import fs from 'fs'
import { clonePackageFromGitHub } from './github.js'
import { getProjectVersion } from './file.js'
import { DEPENDENCY_LANGUAGE, DependencyFile, PUBLIC_GITHUB_TOKEN } from '../constants.js'

/**
 * Parse dependencies from package.json.
 */
export const parsePackageJsonDependencies = (packageJsonText: string) => {
  const packageJson = JSON.parse(packageJsonText)

  return Object.keys({ ...packageJson.dependencies, ...packageJson.devDependencies })
    .filter((key) => packageJson.devDependencies[key] === '*' || packageJson.dependencies[key] === '*')
    .map((key) => (key.startsWith('@') ? key.split('/')[1] : key))
}

/**
 * Parse dependencies from pyproject.toml.
 * Extracts dependencies with Git URLs.
 */
export const parseTomlDependencies = (content: string) => {
  const dependencyLines = content.match(/dependencies\s*=\s*\[(.*?)\]/s)
  if (!dependencyLines) return []

  const dependencies = dependencyLines[1].split(',')
  return dependencies.map((dep) => dep.trim().replace(/["']/g, ''))
}

/**
 * Handle dependencies in package.json or pyproject.toml and returns a list of dependencies.
 * @param {string} filePath - The path to the file (package.json or pyproject.toml).
 * @returns {Promise<string[]>} - A list of dependencies to be cloned.
 */
export const extractDependencies = async (filePath: string) => {
  if (filePath.endsWith(DependencyFile.PackageJson)) {
    // Handle package.json for Node.js dependencies
    const packageJsonContent = fs.readFileSync(filePath, 'utf-8')
    return parsePackageJsonDependencies(packageJsonContent)
  }

  if (filePath.endsWith(DependencyFile.PyProjectToml)) {
    // Handle pyproject.toml for Python dependencies
    const pyprojectContent = fs.readFileSync(filePath, 'utf-8')
    return parseTomlDependencies(pyprojectContent)
  }

  return []
}

/**
 * Check dependency files in the given base path and clone dependencies if needed.
 * @param {string} basePath - The base path to search for dependency files.
 */
export const checkDependencyFiles = async (basePath: string) => {
  const clonePackagePromises: Promise<void>[] = []

  Object.values(DependencyFile).forEach(async (file) => {
    const filePath = path.resolve(basePath, file)
    if (fs.existsSync(filePath)) {
      console.log(`${file} exists at ${filePath}`)

      const localDependencies = await extractDependencies(filePath)
      if (localDependencies.length) {
        const releaseVersion = await getProjectVersion()
        const language = DEPENDENCY_LANGUAGE[file]

        clonePackagePromises.concat(
          localDependencies.map((dependency) =>
            clonePackageFromGitHub({
              language,
              packageName: dependency,
              destination: `${basePath}/packages`,
              githubToken: PUBLIC_GITHUB_TOKEN,
              releaseVersion
            })
          )
        )
      }
    }
  })

  await Promise.all(clonePackagePromises)
}
