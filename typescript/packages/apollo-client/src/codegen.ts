import { generate } from '@graphql-codegen/cli'
import { join } from 'path'
import { config, baseTypesConfig, hooksConfig, operationsConfig, typesConfig } from './config'

async function generateHooks(documents: string, schema: string, prefix: string) {
  await generate({
    documents,
    overwrite: true,
    schema,
    generates: {
      [join(prefix, 'base.ts')]: baseTypesConfig,
      [join(prefix, 'operations.ts')]: operationsConfig,
      [join(prefix, 'types.ts')]: typesConfig,
      [join(prefix, 'hooks.ts')]: hooksConfig
    }
  })
}

async function main() {
  await generateHooks(config.documents, config.schema, config.output)
}

main()
