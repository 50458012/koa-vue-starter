import Vue from 'vue'
import App from './views/layout'
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import ELEMENT from 'element-ui';

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(ELEMENT);
const plugins = []
if (process.env.NODE_ENV !== 'production') {
  plugins.push(require('vuex/dist/logger')())
};

const stores = require.context('./stores', true, /index\.js$/);
const app = new Vue({
  el: '#app',
  router: new VueRouter({
    mode: 'history',
    base: '/',
    scrollBehavior (to, from, savedPosition) {
      return savedPosition || {
        x: 0,
        y: 0
      }
    },
    routes: require.context('./views', true, /index\.vue$/)
      .keys().filter(path => !path.includes('components'))
      .reduce((routes, path) => path.split('/').slice(1, -1)
        .reduce((router, pathItem, index, pathArr) => {
          const name = pathArr.slice(0, index + 1).join('.')
          let target = (router.length && router.find(({ name: NAME }) => name === NAME)) || null
          if (!target) {
            target = {
              path: (!index ? '/' : '') + pathItem,
              name
            }
            router.splice(1, 0, target)
          }
          if (index === pathArr.length - 1) { // 最后一位 返回根数组
            Object.assign(target, {
              component: resolve => require([`./views/${path.slice(2)}`], resolve)
            })
            return routes
          } else { // 增加 children //base路径
            if (!target.children) {
              Object.assign(target, {
                children: [],
                base: '/' + target.name.replace('.', '/')
              })
            }
            // 返回children 数组
            return target.children
          }
        }, routes), [{
        path: '/',
        redirect: '/car'
      }, {
        path: '*',
        redirect: '/404',
        component: resolve => require(['./views/404/index'], resolve)
      }])
  }),
  store: new Vuex.Store({
    modules: stores.keys().reduce((modules, mod) => {
      const res = stores(mod)
      return Object.assign(modules, {
        [mod.slice(2, -9)]: res.__esModule && res.default || res
      })
    }, {}),
    plugins
  }),
  render: h => h(App)
})

console.log(app._router.options.routes);
