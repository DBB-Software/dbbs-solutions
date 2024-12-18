module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src']
      }
    ],
    '@babel/plugin-transform-react-jsx',
    ['@babel/plugin-transform-private-methods', { loose: true }]
  ]
}
