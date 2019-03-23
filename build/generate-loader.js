
const isProd = process.env.NODE_ENV === 'production' ;
console.log(process.env.NODE_ENV, '在utils.js中')
const cssLoaders = [isProd ? require('mini-css-extract-plugin').loader : 'vue-style-loader', {
  loader: 'css-loader',
  options: {
    minimize: isProd,
    sourceMap: !isProd
  }
}, {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    sourceMap: true,
    plugins: [require('autoprefixer')({
      browsers: ['last 100 versions', 'ie > 8'],
      flexbox: true
    })]
  }
}]
const generateLoaders = ([extension, loaderOptions = {}]) => {
  const loaders = []
  if (extension !== 'css') {
    loaders.push({
      loader: `${extension}${extension === 'styl' ? 'us' : ''}-loader`,
      options: Object.assign({
        sourceMap: !isProd
      }, loaderOptions)
    });
  }
  return {
    test: new RegExp('\\.' + extension + '$'),
    use: cssLoaders.concat(...loaders)
  }
};
const stylusOpation = {
  define: {
    aaa: 'bbb',
    'inline-url': require('stylus').url({
      limit: 80000,
      paths: [require('path').join(process.cwd(), 'public')]
    })
  }
};
const pugLoaderOption = {
  loader: 'pug-html-loader',
  options: {
    data: {
      aaa: '我是local数据',
      'NODE_ENV': process.env.NODE_ENV || 'development'
    },
  }
}
module.exports = [{
  test: /\.pug$/,
  oneOf: [{
    resourceQuery: /^\?vue/,
    use: pugLoaderOption
  }, {
    use: [{
      loader: 'html-loader',
      options: {
        attrs: ['img:src']
      }
    }, pugLoaderOption]
  }]
}].concat([
  ['css'],
  ['less'],
  ['sass', {
    indentedSyntax: true
  }],
  ['scss'],
  ['styl', stylusOpation],
  ['stylus', stylusOpation]
].map(generateLoaders));