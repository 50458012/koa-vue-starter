<template lang="pug">
  extends layout.pug
  block scripts
    +fn('ccc')
    +includeTest('这是内部继承于外部的include文件调用的mixin:', '10', 'J', 'Q', 'K', 'A')
    - var lodash  = require('lodash')
    p= lodash.camelCase('abc-def') + '  这是require lodash 后计算的结果'
    p 这个是内部变量传参给继承的外部mixin调用的结果
      p=aaa
      p(v-if=`aaa === ${aaa}`) qqqqqq
      p(v-if="aaa === 'bbb' ") qqqqqq

  append foot
    for i in [1, 2, 3]
          li(:class=`{hot: ${i} === count}`) #{i}
    .bbb
      .ccc(v-demo="name", @demo="bbb") hjkhjkhjk
      el-switch(v-model="aaa"
        active-color="#13ce66"
        inactive-color="#ff4949"
      )
    block content
      
      router-view 
</template>
<script>
import {A_GET_ABOUT} from '../../stores/about/types.js'
import {mapState} from 'vuex'
export default {
  methods: {
    bbb() {
      // console.log('click');
      
    }
  },
  directives: {
    demo: {
      /*inserted(...args) {
        console.log('inserted', args);
      },
      bind(el, bind, vnode) {
        const { componentOptions, data } = vnode;
        console.log(bind, componentOptions, data);
      },
     /* inserted(el, bind, vnode) {
        const { componentOptions, data } = vnode;
        console.log(vnode);
      },
      /*update(el, bind, vnode) {
        const { componentOptions, data } = vnode;
        console.log(vnode);
      },
      componentUpdated(...args) {
        console.log('componentUpdated', args);
      }*/
    }
  },
  data() {
    this.$store.dispatch(A_GET_ABOUT, 'about')
    return {
      count: 2,
      ccc: 'data 变量 123',
      aaa: true,
      list: [10,21,32,43,54,65]
    }
  },
  computed: mapState({
    name: s => s.about.name
  })
}
</script>

<style lang="stylus">
.hot
  color red
  background-color yellow
</style>