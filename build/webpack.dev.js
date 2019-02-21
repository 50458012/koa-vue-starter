
const mode = process.env.NODE_ENV = 'development';
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
var webpack = require('webpack')
// 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=10000&reload=true&noInfo=true'
module.exports = require('webpack-merge')(require('./webpack.base'), {
  mode,
  plugins: [
    // new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new OpenBrowserPlugin({
      url: 'http://127.0.0.1:3000',
      browser: 'chrome'
    })
  ]
})
