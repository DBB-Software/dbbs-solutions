module.exports = {
  extends: ['@dbbs/eslint-config/react', 'plugin:react-native/all', '@react-native'],
  parser: '@typescript-eslint/parser',
  rules: {
    'comma-dangle': 'off',
    'react/react-in-jsx-scope': 'off'
  }
}
