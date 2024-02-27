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
        root: ['./src']
      }
    ],
    '@babel/plugin-transform-react-jsx',
    ['@babel/plugin-transform-private-methods', { loose: true }],
    'react-native-reanimated/plugin'
  ]
}
