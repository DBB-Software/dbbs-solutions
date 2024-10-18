module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
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
      'react-native-reanimated/plugin',
      '@babel/plugin-transform-export-namespace-from'
    ]
  };
};
