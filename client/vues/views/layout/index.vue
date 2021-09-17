<template lang="pug">
  .aaaa
    h1 test
      - let d = 4 
      - d = 5
      p=e 
      div
          p=d
          p=a
          a 1111
          p=e

          ul
              while e > 0
                  - e--
                  - var f = 10 + e
                  li=f
    router-link(to="/car") 这是个router-link
    //- img(src="@/aaa.png")
    router-view
</template>

<script>
export default {
  data() {
    return {
      aaa: 'snake'
    }
  }
}
</script>
<style lang="stylus" scoped>
@import './index.styl';
  /*div
    color blue
    background inline-url('/images/aaa.png')*/
</style>