import { Argv, ArgumentsCamelCase, CommandModule } from 'yargs'
import path from 'path'
import fs from 'fs'
import { writeFile } from 'fs/promises'
import { replaceInFiles, clonePackageFromGitHub, getProjectVersion, downloadGithubFile } from '../utils/index.js'
import projectFilesList from '../project-files-list.js'
import { DEFAULT_PACKAGES, oldPrefix, PUBLIC_GITHUB_TOKEN } from '../constants.js'

const defaultPackageLanguage = 'typescript'

export interface InitProjectArgs extends Argv {
  projectName: string
}

export const initCommand: CommandModule<unknown, InitProjectArgs> = {
  command: 'init <projectName>',
  describe: 'Initialize a new monorepo project',
  builder: (yargs: Argv<unknown>): Argv<InitProjectArgs> =>
    yargs.positional('projectName', {
      describe: 'Name of the project',
      type: 'string'
    }) as Argv<InitProjectArgs>,
  handler: async (args: ArgumentsCamelCase<InitProjectArgs>) => {
    const { projectName } = args

    if (!projectName) {
      console.error('Error: Project name is required!')
      process.exit(1)
    }

    console.log(`Initializing a new monorepo project: ${projectName}...`)
    const projectDir = path.join(process.cwd(), projectName)

    // Ensure the project directory exists
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true })
    }

    const releaseVersion = await getProjectVersion()

    // Clone files from GitHub
    const clonePromises = projectFilesList.files.map((file) =>
      downloadGithubFile(`/release-${releaseVersion}/${file}`, path.join(projectDir, file))
    )
    await Promise.all(clonePromises)

    // Add empty yarn.lock
    await writeFile(`${projectDir}/yarn.lock`, '')

    // Clone default packages

    const packageClonePromises = DEFAULT_PACKAGES.map((packageName) =>
      clonePackageFromGitHub({
        language: defaultPackageLanguage,
        packageName,
        destination: `${projectName}/${defaultPackageLanguage}/packages`,
        githubToken: PUBLIC_GITHUB_TOKEN,
        releaseVersion
      })
    )
    await Promise.all(packageClonePromises)

    // Replace all occurrences of @dbbs/ with the project name in downloaded files
    const newPrefix = `@${projectName}/`
    await replaceInFiles(projectDir, oldPrefix, newPrefix)

    console.log(`Project ${projectName} successfully initialized in ${projectDir}`)
  }
}
