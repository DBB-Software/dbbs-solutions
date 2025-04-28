#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

// Import commands
import { initCommand, addPackageCommand, addApplicationCommand } from './commands/index.js'

const { argv } = yargs(hideBin(process.argv))
  .scriptName('dbbs-cli')
  .usage('$0 <cmd> [args]')
  .command(initCommand)
  .command(addPackageCommand)
  .command(addApplicationCommand)
  .help()

console.log('Yargs initialized with argv:', argv)
