import Vue from 'vue'
import App from './views/layout'
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import ELEMENT from 'element-ui';

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(ELEMENT);
const plugins = [];
if(process.env.NODE_ENV !== 'production') {
  plugins.push(require('vuex/dist/logger')())
};
const views = require.context('./views', true, /[^component]\/index\.vue$/).keys()
console.log(views);

/*const views = require.context('./views', true, /index\.vue/).keys().reduce((res, v)=> v.split('/').slice(1, -1).reduce((r,c,i,view)=> {
  const NAME = view.slice(0, i + 1).join('.');
  let t = r.find(({name}) => name === NAME);
  if (!t) {
    t = {
      path: (!i ? '/' : '') + c,
      name: NAME
    }
    r.push(t)
  }
  if (i === view.length -1) { // 最后一位
    Object.assign(t, {
      component: ok => require([`./views/${v.slice(2)}`], ok)
    })
    return res
  } else { // 增加 children //base路径
    if (!t.children) {
      Object.assign(t, {
        children: []
      })
    }
    return t.children
  }
}, res) , [{
  path: '/',
  redirect: '/car'
}, {
  path: '*',
  component: resolve => require(['./views/404/index'], resolve)
}])
console.log(views)*/

const stores = require.context('./stores', true, /index\.js$/);
const app = new Vue({
  el: '#app',
  router: new VueRouter({
    mode: 'history',
    base: '/',
    scrollBehavior(to, from, savedPosition) {
      return savedPosition || {
        x: 0,
        y: 0
      };
    },
    routes: require.context('./views', true, /[^components]\/index\.vue$/)
    .keys()
    .reduce((res, v)=> v.split('/').slice(1, -1)
    .reduce((r,c,i,a)=> {
      const NAME = a.slice(0, i + 1).join('.');
      let t = r.find(({name}) => name === NAME);
      if (!t) {
        t = {
          path: (!i ? '/' : '') + c,
          name: NAME
        }
        r.unshift(t)
      }
      if (i === a.length -1) { // 最后一位 返回根数组
        Object.assign(t, {
          component: ok => require([`./views/${v.slice(2)}`], ok)
        })
        return res
      } else { // 增加 children //base路径
        if (!t.children) {
          Object.assign(t, {
            children: []
          })
        }
        // 返回children 数组
        return t.children
      }
    }, res) , [{
      path: '/',
      redirect: '/car'
    }, {
      path: '*',
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
// const routers = require.context('./routers', false, /\.js$/);
 /*routers.keys().reduce((routes, mod) => {
      const res = routers(mod) || [];
      return (res.__esModule && res.default || res).concat(routes)
    }, [{
      path: '/',
      redirect: '/car'
    }, {
      name: '404',
      path: '*',
      component: resolve => require(['./views/404/index'], resolve)
    }])*/

    