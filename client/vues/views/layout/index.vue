<template lang="pug">
  .aaaa
    router-link(to="/car") 456456456
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