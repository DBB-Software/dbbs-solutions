import path from 'path'
import fs from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import { API_REPO_URL, DependencyFile, PUBLIC_GITHUB_TOKEN, SOLUTIONS_RAW_BASE_URL } from '../constants.js'
import { extractDependencies } from './dependency.js'
import { checkFileExisting } from './file.js'

type CloneGithubPackageParams = {
  language: string
  packageName: string
  destination: string
  githubToken: string
  releaseVersion: string
  repoPath?: string
}

enum ResultType {
  Directory = 'dir',
  File = 'file'
}

type GithubCloneResult = {
  type: ResultType
  download_url: string
  name: string
  path: string
}

/**
 * Helper function to download and optionally save files using fetch.
 *
 * @param {string} filePath - The URL of the file to download.
 * @param {string} [dest] - The optional destination path where the file will be saved.
 * @returns {Promise<string>} - The content of the file as a string.
 */
export async function downloadGithubFile(filePath: string, dest?: string): Promise<string> {
  console.log(`Downloading from ${filePath}`)

  const response = await fetch(SOLUTIONS_RAW_BASE_URL + filePath, {
    headers: {
      Authorization: `Bearer ${PUBLIC_GITHUB_TOKEN}`
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch file from ${filePath}: ${response.statusText}`)
  }

  const fileContent = await response.text()

  if (dest) {
    const directory = path.dirname(dest) // Extract directory part of the destination path

    console.log(`Ensuring directory exists: ${directory}`)
    await mkdir(directory, { recursive: true }) // Ensure the directory structure exists

    console.log(`Writing file content to ${dest}`)
    await writeFile(dest, fileContent, 'utf8') // Write file content to the specified destination
    console.log(`File successfully downloaded and saved to ${dest}`)
  } else {
    console.log(`File successfully downloaded without saving`)
  }

  return fileContent
}

/**
 * Clone a package from GitHub using GitHub API with authentication and handles dependencies.
 *
 * @param {string} packageName - The name of the package to clone.
 * @param {string} destination - The path where the package should be cloned.
 * @param {string} githubToken - The GitHub token for authentication.
 * @param {string} releaseVersion - The release version tag.
 * @param {string} [repoPath='packages'] - The path to the directory in the GitHub repo.
 * @returns {Promise<void>}
 */
export async function clonePackageFromGitHub({
  language,
  packageName,
  destination,
  githubToken,
  releaseVersion,
  repoPath = `${language}/packages/${packageName}`
}: CloneGithubPackageParams): Promise<void> {
  const directory = path.dirname(destination)
  const packageFile = path.join(directory, 'package.json') // Forming path to the package.json

  // Check if package already exists and exit early
  const exists = await checkFileExisting(packageFile)
  if (exists) {
    console.error(`Package "${packageName}" already exists at ${directory}. Aborting.`)
    process.exit(1)
  }

  const cloneURL = `${API_REPO_URL}/${repoPath}?ref=release-${releaseVersion}`

  console.log(`Cloning package from: ${cloneURL}`)

  try {
    const cloneURLResponse = await fetch(cloneURL, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${githubToken}`
      }
    })

    const filesAndDirs = await cloneURLResponse.json()

    if (cloneURLResponse.ok && Array.isArray(filesAndDirs)) {
      const tasks = filesAndDirs.map(async (item: GithubCloneResult) => {
        const itemPath = path.join(destination, packageName, item.name)

        if (item.type === ResultType.File) {
          const fileUrl = item.download_url

          console.log(`Downloading file: ${item.path}`)
          await downloadGithubFile(fileUrl, itemPath)

          // Handle package.json and pyproject.toml for dependencies
          if (Object.values(DependencyFile).some((dependencyFile) => dependencyFile === item.name)) {
            console.log('Dependency file found, searching for local dependencies...')
            const localDependencies = await extractDependencies(itemPath)
            // Recursively clone the local dependencies

            console.log('Local dependencies:', localDependencies)
            const dependencyCloneTasks = localDependencies.map(async (dependency) =>
              clonePackageFromGitHub({
                language,
                packageName: dependency,
                destination,
                githubToken,
                releaseVersion
              })
            )

            Promise.all(dependencyCloneTasks)
              .then((results) => {
                console.log('All dependencies cloned successfully:', results)
              })
              .catch((error) => {
                console.error('Error cloning dependencies:', error)
              })
          }
        } else if (item.type === ResultType.Directory) {
          if (!fs.existsSync(itemPath)) {
            fs.mkdirSync(itemPath, { recursive: true })
          }
          await clonePackageFromGitHub({
            language,
            packageName,
            destination: itemPath,
            githubToken,
            releaseVersion,
            repoPath: item.path
          })
        }
      })

      await Promise.all(tasks)
    } else {
      console.error(`Package ${packageName} not found in the repository.`)
    }
  } catch (error: unknown) {
    console.error(`Unexpected error occurred while cloning the package:`, error?.toString())
  }
}
