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
          '@navigators': './src/app/navigators',
          '@screens': './src/screens'
        }
      }
    ],
    '@babel/plugin-transform-react-jsx',
    'react-native-reanimated/plugin'
  ]
}
