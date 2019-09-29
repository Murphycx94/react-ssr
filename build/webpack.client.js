const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.base');

const resolve = _path => path.join(__dirname, '..', _path);

const webpackConfig = merge(baseConfig, {
  entry: {
    app: resolve('src/entry/client.jsx')
  },
  output: {
    path: resolve('dist'),
    filename: 'js/[name].[chunkhash].js',
    publicPath: '/dist/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve('public/index.html')
    })
  ]
});

module.exports = webpackConfig;
