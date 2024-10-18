module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'turbo'
  ],
  env: {
    es6: true,
    node: true,
    jest: true
  },
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', '@typescript-eslint', 'jest'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['tsconfig.json']
  },
  rules: {
    semi: ['error', 'never'],
    '@typescript-eslint/ban-ts-comment': 'off',
    'no-console': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'warn',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto'
      }
    ],
    'turbo/no-undeclared-env-vars': 'off'
  },
  ignorePatterns: ['node_modules', 'dist', 'lib', 'coverage', '*test.ts', '*spec.ts', 'jest.config.ts', 'knexfile.ts'],
  overrides: [
    {
      files: ['*test.ts', '*spec.ts'],
      env: {
        jest: true
      }
    }
  ]
}