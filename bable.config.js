// babel.config.js
module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.js', '.json'],
          alias: {
            '@': './src',
          },
        },
      ],
    ],
  };