import Vue from 'vue'

// import Vuex from 'vuex';
import App from './views/layout'
console.log(123123)
// import VueRouter from 'vue-router';
// const app =  new Vue(App).$mount('#app')
// const app = new Vue(...App)
// app.$amount('#app')
new Vue({
  el: '#app',
  render: h => h(App)
})