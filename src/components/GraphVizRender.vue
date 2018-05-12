<template lang="html">
  <div class="render-wrapper">
  </div>
</template>

<script>
import Viz from 'viz.js'
// import _ from 'lodash'

export default {
  name: 'GraphVizRender',
  props: ['dotData'],
  watch: {
    dotData () {
      this.render(this.dotData) // direct render bc. vuex data debounced
    }
  },
  mounted () {
    // initial render (if data not undefined)
    if (this.dotData) {
      this.render(this.dotData)
    }
  },
  methods: {
    render (data) {
      try {
        this.$el.innerHTML = Viz(data) // , this.config)
        this.$emit('error', '')
        this.$store.commit('createPanZoom')
        if (document.querySelector('svg')) {
          this.$store.commit('updateSVGSize',
          document.querySelector('svg').getBBox())
        }
      } catch (err) {
        // render error to label later
        this.$emit('error', err.message)
      }
    }
  }
}
</script>

<style lang="css">

.render-wrapper {
  border: 1px solid #EEEEEE;
  border-radius: 0 0 4px 4px;
  min-height: 100px;
}

svg {
  width: 100%;
  height: 75vh;
  background-color: #fff;
}


</style>
