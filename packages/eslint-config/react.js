const tsConfigs = ['tsconfig.json', 'tsconfig.spec.json', 'tsconfig.app.json', 'tsconfig.lib.json']

module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
    'cypress/globals': true
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'eslint:recommended',
    'prettier',
    'turbo'
  ],
  parserOptions: {
    project: tsConfigs
  },
  plugins: ['prettier', '@typescript-eslint', 'jest', 'cypress'],
  rules: {
    'turbo/no-undeclared-env-vars': 'off',
    'no-unused-vars': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-console': 'off',
    semi: ['error', 'never'],
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/function-component-definition': [
      'warn',
      {
        namedComponents: ['function-declaration', 'function-expression', 'arrow-function'],
        unnamedComponents: ['function-expression', 'arrow-function']
      }
    ],
    'react/jsx-props-no-spreading': 'off',
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    'prefer-const': 'error',
    'no-import-assign': 'error',
    'no-self-assign': 'error',
    'jsx-quotes': ['error', 'prefer-double'],
    'no-restricted-exports': 'off',
    'import/extensions': 'off',
    'array-callback-return': 'off',
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
    'react/display-name': 'off',
    quotes: ['error', 'single'],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto'
      }
    ]
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  ignorePatterns: ['node_modules/', 'dist/', 'lib/', 'coverage/', 'build/']
}
