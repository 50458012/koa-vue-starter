'use strict'
const app = new (require('koa'))()
/* const path = require('path')

// 静态资源部署
const pro_dir = path.resolve(__dirname, '../', 'public') */

//  koa-body request body 解析
app.use(require('koa-body')())
// 网页模板引擎
/* app.use(require('koa-views')(path.resolve('public/dist'), {
  default: 'html',
  extension: 'html',
  options: {
    pretty: false,
    debug: false,
    // compileDebug: false,
    // cache: options.viewsCache,
    // basedir: options.viewsDir
  }
})); 
const router = require('koa-router')() ;
router.get('*', ctx => ctx.render('index'))
// 路由服务API
app.use(router.routes());
app.use(router.allowedMethods()); */
app.use(require('koa2-history-api-fallback')({
  htmlAcceptHeaders: ['text/html'],
  index: '/dist/index.html'
}))

debugger


app.use(require('koa-static')('public'))
// module.exports = app

const HotMid = async () => {
  if (process.env.NODE_ENV !== 'production') {
    return require('koa-webpack')({
      config: require('./build/webpack.dev'),
      devMiddleware: {
        stats: 'minimal'
      }
    }).then(m => {
      return app.use(m)
    })
  }
}




const port = 3000 ;
const appStart = () => {
  HotMid().then(() => {
    app.listen(port, ()=> {
      console.log('服务器已经启动> 3000')
    })
  })
}
// 检测端口是否被占用
const server = require('net').createServer().listen(port);
server.on('listening', function () { // 执行这块代码说明端口未被占用
  server.close() // 关闭服务
  appStart()
})

server.on('error', function (err) {
  if (err.code === 'EADDRINUSE') { // 端口已经被使用
    console.log('端口被占用，正在关闭当前端口')
    const exec = require('child_process').exec ;
    exec(process.platform=='win32'?'netstat -ano':'ps aux', (err, stdout, stderr) => {
      if(err){ return console.log(err); }
      stdout.split('\n').findIndex((line) => {
        const [,adress,,,pid] = line.trim().split(/\s+/);
        if (adress && adress.split(':')[1] == port)  {
          exec('taskkill /F /pid ' + pid, err => {
            if(err){
              console.log(err)
                return console.log('释放指定端口失败！！请手动关闭');    
            }
            console.log('释放端口成功')
            appStart()
          })
          return true
        }
      })
    })
  }
})

