<template lang="html">
  <div class="render-wrapper">
  </div>
</template>

<script>
import Viz from 'viz.js'
import _ from 'lodash'

export default {
  name: 'GraphVizRender',
  props: ['dotData'],
  // data () {
  //   return {
  //     panZoom: undefined
  //     // config: { format: 'png-image-element', scale: 2 }
  //   }
  // },
  watch: {
    dotData () {
      this.renderDebounced(this.dotData)
    }
  },
  mounted () {
    // initial render (if data not undefined)
    if (this.dotData) {
      this.render(this.dotData)
    }

    // this.$nextTick(() => {
    //   let svgElement = document.querySelector('svg')
    //   let panZoom = svgPanZoom(svgElement, {
    //     viewportSelector: '.render-wrapper',
    //     zoomEnabled: true,
    //     controlIconsEnabled: true,
    //     fit: true,
    //     center: true,
    //     minZoom: 0.1
    //   })
    //
    //   this.panZoom = panZoom // save for later use -> disable controls on print
    //
    //   // panZoom.updateBBox()
    // })
  },
  methods: {
    render (data) {
      this.$el.innerHTML = Viz(data) // , this.config)

      // this.$store.commit('createPanZoom')
    },
    renderDebounced: _.debounce(function (data) {
      try {
        this.render(data)
        this.$emit('error', '')
      } catch (err) {
        // render error to label later
        console.log('error', err.message)

        this.$emit('error', err.message)
      }
      // $(this.$el).html(Viz(data))
    }, 500)
  }
}
</script>

<style lang="css">
.render-wrapper {
  border: 1px solid #EEEEEE;
  border-radius: 0 0 4px 4px;
}
svg {
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}
</style>
