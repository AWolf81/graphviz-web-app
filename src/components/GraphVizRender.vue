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
      // this.renderDebounced(this.dotData)
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
        this.$store.commit('createPanZoom')
        this.$store.commit('updateSVGSize',
          document.querySelector('svg').getBBox())
        this.$emit('error', '')
      } catch (err) {
        // render error to label later
        console.log('error', err.message)

        this.$emit('error', err.message)
      }
    }
    // renderDebounced: _.debounce(function (data) {
    //   try {
    //     this.render(data)
    //     this.$emit('error', '')
    //   } catch (err) {
    //     // render error to label later
    //     console.log('error', err.message)
    //
    //     this.$emit('error', err.message)
    //   }
    //   // $(this.$el).html(Viz(data))
    // }, 500)
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
}
</style>
