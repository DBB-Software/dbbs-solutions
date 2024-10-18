import { autogenCommentPlugin, importAndExportBaseTypesPlugin, importResultTypesPlugin } from './plugins'

export const config = {
  schema: process.env.SCHEMA as string,
  documents: process.env.DOCUMENTS as string,
  output: process.env.OUTPUT as string
}

export const baseTypesConfig = {
  plugins: [autogenCommentPlugin, 'typescript']
}

export const operationsConfig = {
  plugins: [autogenCommentPlugin, 'named-operations-object'],
  config: {
    useConsts: true,
    identifierName: 'Operations'
  }
}

export const typesConfig = {
  plugins: [autogenCommentPlugin, importAndExportBaseTypesPlugin, 'typescript-operations'],
  config: {
    dedupeOperationSuffix: true,
    namespacedImportName: 'Types'
  }
}

export const hooksConfig = {
  plugins: [autogenCommentPlugin, importResultTypesPlugin, 'typescript-react-apollo'],
  config: {
    withHooks: true,
    withResultType: true,
    useTypeImports: true,
    withMutationFn: false,
    withMutationOperationType: false,
    dedupeOperationSuffix: true,
    importOperationTypesFrom: 'Types'
  }
}
