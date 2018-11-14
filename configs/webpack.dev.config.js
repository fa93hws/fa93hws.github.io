const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');

const config = require('./webpack.base.config');

module.exports = merge(config, {
  output: {
    filename: "static/js/[name].[hash:8].js",
    chunkFilename: 'static/js/[name].[hash:8].js',
    path: path.resolve(__dirname, '../dist/'),
    publicPath: '/'
  },
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.WatchIgnorePlugin([
      /less\.d\.ts$/, /css\.d\.ts$/
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        use: [
          'style-loader',
          'typings-for-css-modules-loader?modules&namedExport&camelCase&localIdentName=[local]--[hash:base64:5]',
          {
            loader: 'less-loader',
            options: { javascriptEnabled: true },
          },
          'postcss-loader'
        ]
      }
    ]
  }
})