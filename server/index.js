const app = new (require('koa'))()
const pug = require('pug')
const path = require('path') 

app.use((ctx, next) => {
  ctx.state = {
    fn: (a, b) => a + b,
    require,
    aaa: '我是pug-loader定义变量',
    'NODE_ENV': process.env.NODE_ENV || 'production'
  }
  next()
})

app.use(async ctx => {
  const html = pug.renderFile(path.resolve(__dirname, '../index.pug'), Object.assign({ local: '123 + 456' }, ctx.state))
  ctx.response.type = 'text/html; charset=utf-8'
  ctx.response.body = html
})

app.listen(3004, () => {
  console.log('服务器已经启动> 3004')
})