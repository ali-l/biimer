const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const isProduction = process.env.NODE_ENV == 'production';

let clientConfig = {
  entry: {
    client: './client/initialize'
  },
  output: {
    filename: isProduction ? '[name]-[chunkhash].js' : '[name].js',
    path: path.resolve(__dirname, isProduction ? 'dist/client' : 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: path.resolve(__dirname, 'node_modules/'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', {
                modules: false
              }],
              'stage-0',
              'react'
            ]
          }
        }
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.scss', '.jsx', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/assets/index.html'
    })
  ],
  devServer: {
    port: 8081,
    historyApiFallback: true
  }
};

let serverConfig = {
  entry: {
    sharesCreate: './server/lambdas/shares/create',
    sharesShow: './server/lambdas/shares/show',
    sharesDestroy: './server/lambdas/shares/destroy',
    deleteDropboxFile: './server/lambdas/deleteDropboxFile'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/server'),
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: path.resolve(__dirname, 'node_modules/'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', {
                modules: false,
              }],
              'stage-0'
            ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new webpack.IgnorePlugin(/vertx/),
    new webpack.DefinePlugin({ "global.GENTLY": false })
  ],
  target: 'node'
};

module.exports = [clientConfig, serverConfig];
