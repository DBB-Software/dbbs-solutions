import { ArgumentsCamelCase, Argv, CommandModule } from 'yargs'
import path from 'path'
import fs from 'fs'
import { clonePackageFromGitHub, replaceInFiles, getProjectVersion } from '../utils/index.js'
import { oldPrefix, PUBLIC_GITHUB_TOKEN, SupportedLanguage } from '../constants.js'

export interface AddPackageArgs extends Argv {
  language: keyof typeof SupportedLanguage
  packageName: string
}

export const addPackageCommand: CommandModule<unknown, AddPackageArgs> = {
  command: 'add-package <language> <packageName>',
  describe: 'Add a package to the project',
  builder: (yargs: Argv<unknown>): Argv<AddPackageArgs> =>
    yargs
      .positional('language', {
        describe: 'Programming language (py for Python, ts for TypeScript)',
        type: 'string',
        choices: Object.keys(SupportedLanguage)
      })
      .positional('packageName', {
        describe: 'Name of the package to add',
        type: 'string'
      }) as Argv<AddPackageArgs>,
  handler: async (args: ArgumentsCamelCase<AddPackageArgs>) => {
    const { language, packageName } = args
    const projectDir = process.cwd()

    // Check if package.json exists in the current directory
    const packageJsonPath = path.join(projectDir, 'package.json')
    if (!fs.existsSync(packageJsonPath)) {
      console.error('Error: package.json not found in the current directory.')
      process.exit(1)
    }

    // Determine the directory based on the language argument
    const languagePath = SupportedLanguage[language]

    if (!languagePath) {
      console.error('Error: Unsupported language. Use "py" for Python or "ts" for TypeScript.')
      process.exit(1)
    }

    const languageDir = path.join(projectDir, languagePath)
    const packagesDir = path.join(languageDir, 'packages')

    // Ensure the language and packages directories exist
    if (!fs.existsSync(packagesDir)) {
      fs.mkdirSync(packagesDir, { recursive: true })
    }

    // Clone the specified package from GitHub

    const releaseVersion = await getProjectVersion()

    console.log(`Adding package ${packageName} to ${packagesDir}`)
    await clonePackageFromGitHub({
      language: languagePath,
      packageName,
      destination: packagesDir,
      githubToken: PUBLIC_GITHUB_TOKEN,
      releaseVersion
    })

    // Replace occurrences of @dbbs/ with the project name in the package files
    const newPrefix = `@${path.basename(projectDir)}/`
    await replaceInFiles(packagesDir, oldPrefix, newPrefix)

    console.log(`Package ${packageName} added successfully to ${languageDir}!`)
  }
}
