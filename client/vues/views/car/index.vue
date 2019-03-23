<template lang="pug">
  .bbb
    .aaa {{name}}
    .ccc(v-demo="name", @demo="bbb") hjkhjkhjk
    el-switch(v-model="aaa"
      active-color="#13ce66"
      inactive-color="#ff4949"
    )
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
      aaa: 123
    }
  },
  computed: mapState({
    name: s => s.about.name
  })
}
</script>
