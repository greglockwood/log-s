module.exports = {
  entry: ['babel-polyfill', './lib/web/client/index.js'],
  output: { filename: './lib/web/public/bundle.js' },
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['latest', 'react', 'stage-0', 'stage-2'],
          plugins: ['transform-decorators-legacy']
        },
      },
    ],
  },
};