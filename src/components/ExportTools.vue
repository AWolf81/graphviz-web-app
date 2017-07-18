<template lang="html">
  <div>
    <div v-if="showExportSettings" class="settings-panel">
      <label>Scale</label>
      <input v-model="scale" type="number" min="0.1"/>
      <span>Exported image size (w x h): {{ displaySize() }}</span>
    </div>
  <div class="btn-group navbar-btn navbar-right">
    <button class="btn btn-default"
      @click="showExportSettings = !showExportSettings">
        <span class="glyphicon glyphicon-wrench" aria-hidden="true"></span>
        Settings</button>
    <button class="btn btn-default" @click="savePNG" aria-label="Left Align">
      <span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>
      <span class="label label-default">(png)</span></button>
      <button class="btn btn-default" @click="saveSVG"aria-label="Left Align">
        <span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>
        <span class="label label-default">(svg)</span></button>
      </div>
    </div>
    </template>

    <script>
    import {saveSvgAsPng, saveSvg} from 'save-svg-as-png'
    import {mapState} from 'vuex'

    export default {
      data () {
        return {
          showExportSettings: false,
          saveCb: undefined,
          scale: 2.0
        }
      },
      computed: {
        ...mapState({
          controlsVisible: (state) => state.panZoom.controlsVisible
        }),
        size () {
          let svg = document.querySelector('svg')
          return svg.getBBox()
        }
      },
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
        displaySize () {
          let width = (this.scale * this.size.width).toFixed(2)
          let height = (this.scale * this.size.height).toFixed(2)
          return `${width} x ${height} px`
        },
        savePNG () {
          // this.$store.commit('disableControls')
          // this.$store.commit('resetZoom')

          let svg = document.querySelector('svg')
          let bBox = svg.getBBox()
          let scale = this.scale
          let exportSvg = svg.cloneNode(true) // .cloneNode(true)
          // svg.setAttribute('transform', 'scale(3)')
          exportSvg.setAttribute('width', bBox.width * scale)
          exportSvg.setAttribute('height', bBox.height * scale)
          exportSvg.setAttribute('viewBox', `0 0 ${bBox.width * scale} ${bBox.height * scale}`)
          exportSvg.setAttribute('transform', `scale(${scale})`)
          console.log(exportSvg)
          saveSvgAsPng(exportSvg, 'diagram.png')
          // this.saveCb = function () {
          //   let svg = document.querySelector('svg')
          //   let exportFrame = document.querySelector('exportFrame')
          //
          //   exportFrame.innerHTML = svg
          //   //saveSvgAsPng(svg, 'diagram.png')
          // }
          // this.saveCb()
        },
        saveSVG () {
          saveSvg(document.querySelector('svg'), 'diagram.svg')
        }
      }
    }
    </script>

    <style lang="css" scoped>
    .exportFrame {
      position: fixed;
      top: 0px;
      left: 0px;
      bottom: 0px;
      right: 0px;
      width: 100%;
      height: 100%;
      /*background-color: blue;*/
      z-index: 998;
      pointer-events: none;
    }

    .settings-panel {
      position: absolute;
      width: 10em;
      
      background-color: gray;
      border-radius: 5px;
      z-index: 10;
    }
    </style>
