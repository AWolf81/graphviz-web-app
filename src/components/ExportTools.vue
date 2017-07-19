<template lang="html">
  <div class="navbar-right">
      <div class="btn-group" :class="{open: showExportSettings}"
        v-on-clickaway="hideDropdown">
        <button class="btn btn-default dropdown-toggle navbar-btn" type="button" @click="showExportSettings = !showExportSettings">
          <span class="glyphicon glyphicon-wrench" aria-hidden="true"></span>
          Settings <span class="caret"></span></button>
        </button>
        <div class="dropdown-menu"  v-if="showExportSettings" :aria-expanded="showExportSettings">
          <div class="form-group">
              <label label-for="scale-input">Scale <small>(only raster image)</small></label>
              <input id="scale-input" v-model="scale" type="number" min="0" step="0.5"/>
          </div>
          <small>Exported image size (w x h):<br/>{{ displaySize() }}</small>

        </div>
      </div>
      <div class="btn-group">
        <button class="btn btn-default navbar-btn" @click="savePNG" aria-label="Left Align">
          <span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>
            <!-- <span class="label label-default">(png)</span> -->
            (PNG)
          </button>
          <button class="btn btn-default navbar-btn" @click="saveSVG"aria-label="Left Align">
            <span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>
            <!-- <span class="label label-default">(svg)</span> -->
            (SVG)
          </button>
      </div>
    </div>
</template>

    <script>
    import {saveSvgAsPng, saveSvg} from 'save-svg-as-png'
    import {mapState} from 'vuex'
    import {mixin as clickaway} from 'vue-clickaway'

    export default {
      mixins: [clickaway],
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
        hideDropdown () {
          console.log('hide')
          this.showExportSettings = false
        },
        displaySize () {
          let width = Math.round(this.scale * this.size.width)
          let height = Math.round(this.scale * this.size.height)
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

    .dropdown-menu {
      padding: 1em;
    }
    </style>
