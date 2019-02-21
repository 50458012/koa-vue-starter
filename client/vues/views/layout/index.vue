<template lang="pug">
  .aaaa
    div 1111000
    br
    br
    br
    img(src="@/aaa.png")
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
  div
    color blue
    background inline-url('/images/aaa.png')
</style>