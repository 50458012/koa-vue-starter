'use strict';
const app = new (require('koa'))() ;

const path = require('path') ;

// 静态资源部署
const pro_dir = path.resolve(__dirname, '../', 'public')

//  koa-body request body 解析
app.use(require('koa-body')())
// 网页模板引擎
/*app.use(require('koa-views')(path.resolve('public/dist'), {
  default: 'html',
  extension: 'html',
  options: {
    pretty: false,
    debug: false,
    // compileDebug: false,
    // cache: options.viewsCache,
    // basedir: options.viewsDir
  }
}));*/
/*const router = require('koa-router')() ;
router.get('*', ctx => ctx.render('index'))
// 路由服务API
app.use(router.routes());
app.use(router.allowedMethods());*/
app.use(require('koa2-history-api-fallback')({
  htmlAcceptHeaders: ['text/html'],
  index: 'dist/index.html'
}));
require('koa-webpack')({
  config: require('../build/webpack.dev'),
  devMiddleware: {
    stats: 'minimal'
  }
}).then(m => {
  app.use(m)
});

app.use(require('koa-static')('./public'));
// app.use(middleware);

/*.then(middleware => {
  app.use(async (ctx) => {
    const filename = path.resolve('public/dist/index.html')
    ctx.response.type = 'html'
    ctx.response.body = middleware.devMiddleware.fileSystem.createReadStream(filename)
  });
})*/

app.listen(3000,()=> console.log('服务器已经启动> 3000'));
// module.exports = app ;