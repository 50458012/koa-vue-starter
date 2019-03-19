// const webpack = require('webpack') ;
const path = require('path') ;
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const JOIN = (...dir) => path.join(__dirname, '../', ...dir);
module.exports = {
  target: 'web',
  entry: {
    client: [JOIN('client', 'vues')]
  },
  output: {
    path: JOIN('public', 'dist'),
    filename: 'js/[name].js',
    publicPath: '/dist/'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vues: JOIN('client', 'vues'),
      js: JOIN('client', 'js'),
      '@': JOIN('public', 'images')
    },
    modules: [
      JOIN('node_modules')
    ]
  },
  module: {
    rules: [/*{
      test: /\.(vue|js)$/,
      loader: 'eslint-loader',
      exclude: /node_modules/,
      enforce: 'pre'
    }, */{
      test: /\.vue$/,
      use: {
        loader: 'vue-loader',
        options: {
          preserveWhitepace: true
        }
      },
      include: JOIN('client')
    }, {
      test: /\.js$/,
      loaders: ['babel-loader'],
      exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file)
    }, {
      test: /\.(ico|png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      query: {
        limit: 80000,
        name: 'img/[name].[hash:8].[ext]'
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 30,
          name: 'fonts/[name].[hash:8].[ext]'
        }
      }
    }].concat(require('./generate-loader'))
  },
  plugins: [
    // 和 vue-loader 配合使用
    new VueLoaderPlugin(),
    // 输出 index.html 到 output
    new HtmlwebpackPlugin({
      template: './index.pug',
      filename: './index.html',
      favicon: JOIN('public/favicon.ico')
    })
  ]
} 
