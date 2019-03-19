const mode = process.env.NODE_ENV = 'production'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const path = require('path')

module.exports = require('webpack-merge')(require('./webpack.base'), {
  mode,
  externals: {
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
    'element-ui': 'ELEMENT'
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      fallback: 'vue-style-loader'
    }),
    new CleanWebpackPlugin('dist', {
      root: path.join(__dirname, '../public')
    })
  ]
})
