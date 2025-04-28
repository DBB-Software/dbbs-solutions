import { Argv, ArgumentsCamelCase, CommandModule } from 'yargs'
import { runGenerator } from '../utils/generator.js'

export interface GenArgs {
  templateName: string
}

export const addApplicationCommand: CommandModule<unknown, GenArgs> = {
  command: 'add-application <templateName>',
  describe: 'Generate files for a specific template',
  builder: (yargs: Argv<unknown>): Argv<GenArgs> =>
    yargs.positional('templateName', {
      describe: 'Name of the template to generate',
      type: 'string'
    }) as Argv<GenArgs>,
  handler: async (args: ArgumentsCamelCase<GenArgs>) => {
    const { templateName } = args

    if (!templateName) {
      console.error('Error: Template name is required!')
      process.exit(1)
    }

    console.log(`Running generator for: ${templateName}`)
    await runGenerator(templateName)
  }
}
