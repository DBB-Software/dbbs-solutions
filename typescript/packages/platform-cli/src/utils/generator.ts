import { NodePlopAPI } from 'plop'
import nodePlop from 'node-plop'
import path from 'path'
import { replaceInFiles } from './file.js'
import plopfile from '../generators/config.js'
import { concat, encodeMyString, ifCond, downloadGithubFile } from './index.js'
import { oldPrefix } from '../constants.js'
import { checkDependencyFiles } from './dependency.js'

// Utility to fetch and render templates dynamically
export const fetchTemplateContent = async (
  templateUrl: string,
  answers: Record<string, unknown>,
  plop: NodePlopAPI
) => {
  try {
    const templateContent = await downloadGithubFile(templateUrl)
    console.log('Fetched raw template content for', templateUrl)

    const renderedContent = plop.renderString(templateContent, answers)
    console.log('Rendered template content for', templateUrl)

    return renderedContent
  } catch (error) {
    console.error('Error fetching template content from GitHub:', error)
    throw new Error(`Failed to fetch or render template: ${templateUrl}`)
  }
}

// Utility to sanitize template keys by replacing special characters
export const sanitizeTemplateKey = (key: string) => key.replace(/[^a-zA-Z0-9_]/g, '_')

// Reusable function to generate actions based on template configuration
export const generateTemplateActions = (templates: Record<string, string>) =>
  Object.entries(templates).map(([templateName, templateKey]) => {
    const sanitizedKey = sanitizeTemplateKey(templateKey)

    return {
      type: 'add',
      path: `${process.cwd()}/apps/{{ name }}/${templateName}`,
      template: `{{{ templates.${sanitizedKey} }}}`
    }
  })

export const runGenerator = async (templateName: string) => {
  try {
    // Initialize Plop
    const plopInstance: NodePlopAPI = await nodePlop()

    // Register the generator
    await plopfile(plopInstance)

    // Find the generator by name
    const generator = plopInstance.getGenerator(templateName)
    if (!generator) {
      console.error(`Error: Generator "${templateName}" not found!`)
      process.exit(1)
    }

    plopInstance.setHelper('ifCond', ifCond)
    plopInstance.setHelper('concat', concat)
    plopInstance.setHelper('encodeMyString', encodeMyString)

    // Run generator prompts
    console.log('Running generator prompts')
    const answers = await generator.runPrompts()
    await generator.runActions(answers)

    // Process results to get the base path
    const basePath = path.resolve(process.cwd(), 'apps', answers.name || '')
    console.log(`Base path for file checks: ${basePath}`)

    // Run the file existence check
    await checkDependencyFiles(basePath)

    console.log(`Replacing old prefix in files...`)
    const newPrefix = `@${answers.name}/`
    await replaceInFiles(path.resolve(process.cwd(), 'apps', answers.name || ''), oldPrefix, newPrefix)

    console.log(`Generator "${templateName}" completed successfully!`)
  } catch (error) {
    console.error(`Error while running generator`, error)
    process.exit(1)
  }
}
