module.exports = {
  presets: ['module:@react-native/babel-preset'],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@shared': './src/shared'
        }
      }
    ],
    '@babel/plugin-transform-react-jsx',
    'react-native-reanimated/plugin',
    'transform-inline-environment-variables',
    '@babel/plugin-transform-export-namespace-from'
  ]
}
