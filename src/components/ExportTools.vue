<template lang="html">
  <div class="btn-group navbar-btn navbar-right">
    <button class="btn btn-default" @click="savePNG" aria-label="Left Align">
      <span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>
      <span class="label label-default">(png)</span></button>
    <button class="btn btn-default" @click="saveSVG"aria-label="Left Align">
      <span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>
      <span class="label label-default">(svg)</span></button>
  </div>
</template>

<script>
import {saveSvgAsPng, saveSvg} from 'save-svg-as-png'
import {mapState} from 'vuex'

export default {
  data () {
    return {
      saveCb: undefined
    }
  },
  computed: mapState({
    controlsVisible: (state) => state.panZoom.controlsVisible
  }),
  watch: {
    controlsVisible () {
      console.log('controlsVisible changed', this.controlsVisible, this.saveCb)
      if (this.saveCb && !this.controlsVisible) {
        console.log('watch triggered')
        this.saveCb()
        // this.$store.commit('enableControls')
        // this.$store.commit('restoreZoom')
      }
    }
  },
  methods: {
    savePNG () {
      // this.$store.commit('disableControls')
      // this.$store.commit('resetZoom')

      this.saveCb = function () {
        let svg = document.querySelector('svg')
        saveSvgAsPng(svg, 'diagram.png')
      }
      this.saveCb()
    },
    saveSVG () {
      saveSvg(document.querySelector('svg'), 'diagram.svg')
    }
  }
}
</script>

<style lang="css">
</style>
