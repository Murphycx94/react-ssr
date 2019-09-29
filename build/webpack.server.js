const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');

const resolve = _path => path.join(__dirname, '..', _path);

const webpackConfig = merge(baseConfig, {
  entry: {
    app: resolve('src/entry/server.jsx')
  },
  output: {
    path: resolve('dist'),
    filename: 'entry-server.js',
    libraryTarget: 'commonjs2',
    libraryExport: 'default'
  },
  target: 'node',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.REACT_ENV': JSON.stringify('server')  // 指定React环境为服务端
    })
  ]
});

module.exports = webpackConfig
