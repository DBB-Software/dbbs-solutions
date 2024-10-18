module.exports = {
    extends: ['@dbbs/eslint-config/react', 'plugin:react-native/all', '@react-native'],
    rules: {
        'comma-dangle': 'off',
        'react/react-in-jsx-scope': 'off',
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "react/no-unstable-nested-components": "off",
    }
}