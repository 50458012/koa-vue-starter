import Vue from 'vue'
import App from './views/layout'
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import ELEMENT from 'element-ui';

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(ELEMENT);
// var bbb = 'axios'
// import(bbb).then(aaa => {
//   console.log(aaa);
  
// })

const plugins = [];
if(process.env.NODE_ENV !== 'production') {
  plugins.push(require('vuex/dist/logger')())
};
const routers = require.context('./routers', false, /\.js$/);
const stores = require.context('./stores', true, /index\.js$/);
const app = new Vue({
  el: '#app',
  router: new VueRouter({
    mode: 'history',
    base: '/',
    redirect: '/car',
    scrollBehavior(to, from, savedPosition) {
      return savedPosition || {
        x: 0,
        y: 0
      };
    },
    
    routes: routers.keys().reduce((routes, mod) => {
      const res = routers(mod) || [];
      return (res.__esModule && res.default || res).concat(routes)
    }, [{
      path: '/',
      redirect: '/car'
    }, {
      name: '404',
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
