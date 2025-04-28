import { readFile, writeFile, readdir, lstat } from 'fs/promises'
import path from 'path'
import fs from 'fs'
import { exec } from 'child_process'
import { promisify } from 'util'

promisify(exec)

/**
 * Retrieves the project version from package.json.
 *
 * @returns {Promise<string>} - The current project version.
 */
export async function getProjectVersion(): Promise<string> {
  const packageJsonPath = path.resolve(import.meta.dirname, '../../package.json')
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'))

  if (!packageJson.version) throw new Error('Version not found in package.json')
  return packageJson.version
}

/**
 * Replace a string in all files within a directory.
 *
 * @param {string} directory - The root directory to search in.
 * @param {string} searchValue - The string to search for.
 * @param {string} replaceValue - The string to replace with.
 * @returns {Promise<void>}
 */
export async function replaceInFiles(directory: string, searchValue: string, replaceValue: string): Promise<void> {
  const files = await readdir(directory)

  const tasks = files.map(async (file) => {
    const filePath = path.join(directory, file)
    const stat = await lstat(filePath)

    if (stat.isDirectory()) {
      await replaceInFiles(filePath, searchValue, replaceValue) // Recursive call for directories
    } else {
      let content = await readFile(filePath, 'utf8')
      if (content.includes(searchValue)) {
        content = content.replace(new RegExp(searchValue, 'g'), replaceValue)
        await writeFile(filePath, content, 'utf8')
        console.log(`Replaced occurrences in ${filePath}`)
      }
    }
  })

  await Promise.all(tasks)
}

export async function checkFileExisting(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK)
    return true // File exist
  } catch {
    return false // File doesn't exist
  }
}
