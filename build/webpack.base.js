const webpack = require('webpack');
const path = require('path');


function factory (env) {

  const isProd = env === 'production';
  const isDev = env === 'development';

  return {
    mode: env,
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',
    resolve: {
      extensions: ['.js', '.jsx', '.json']
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          loader: ['babel-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'img/[name].[hash:7].[ext]'
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'fonts/[name].[hash:7].[ext]'
          }
        }
      ]
    },
    plugins: [
    ]
  }
}

if (!process.env.NODE_ENV) {
  process.env.BABEL_ENV = process.env.NODE_ENV = 'development'
}

module.exports = factory(process.env.NODE_ENV);
