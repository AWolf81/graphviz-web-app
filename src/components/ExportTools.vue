<template lang="html">
  <div>
      <div class="btn-group" :class="{open: showExportSettings}"
        v-on-clickaway="hideDropdown">
        <button class="btn btn-default navbar-btn" type="button" @click="showExportSettings = !showExportSettings">
          <span class="glyphicon glyphicon-wrench" aria-hidden="true"></span>
          <span class="hidden-xs">Settings <span class="caret"></span></span></button>
        </button>
        <div class="dropdown-menu"  v-if="showExportSettings" :aria-expanded="showExportSettings">
          <div class="form-group">
              <label label-for="scale-input">Scale <small>(only raster image)</small></label>
              <input id="scale-input" v-model.number="scale" @keyup="scaleChanged" @change="scaleChanged" type="number" min="0" step="0.5"/>
          </div>
          <small>Exported image size (w x h):<br/>{{ displaySize() }}</small>

        </div>
      <!-- </div>
      <div class="btn-group save-buttons"> -->
        <button title="save as png" class="btn btn-default navbar-btn" @click="savePNG" aria-label="Left Align">
          <span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>
            <!-- <span class="label label-default">(png)</span> -->
            <span class="save-button-label">(PNG)</span>
          </button>
          <button title="save as svg" class="btn btn-default navbar-btn" @click="saveSVG"aria-label="Left Align">
            <span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>
            <!-- <span class="label label-default">(svg)</span> -->
            <span class="save-button-label">(SVG)</span>
          </button>
      </div>
      <div id="debug">
      </div>
    </div>
</template>

    <script>
    import _ from 'lodash'
    import {mapState} from 'vuex'
    import {mixin as clickaway} from 'vue-clickaway'

    export default {
      mixins: [clickaway],
      created () {
        let storedSetting = this.$ls.get('settings')
        if (storedSetting) {
          this.scale = storedSetting.scale
        }
      },
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
          // size: (state) => state.panZoom.size
        })
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
          let svg = document.querySelector('svg') // .graph')
          let size = svg.getClientRects()[0]
          console.log('display size', size, this.scale, svg.getClientRects())
          let width = this.scale * Math.trunc(size.width)
          let height = this.scale * Math.trunc(size.height)
          return `${width} x ${height} px`
        },
        scaleChanged: _.debounce(function () {
          console.log('save new scale debouced')
          // save scale in localstorage
          // later saved related to current url id/name
          this.$ls.set('settings', { // todo add object assign later for more settings
            scale: this.scale
          })
        }, 400),
        savePNG () {
          console.log(this.$store)
          this.$store.dispatch('saveAsPng', this.scale)
          // this.$store.commit('disableControls')
          // this.$store.commit('resetZoom')
          // // let graph = document.querySelector('.graph')
          // // let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
          // // svg.appendChild(graph)
          //
          // let svg = document.querySelector('svg')
          // let bBox = svg.getBBox()
          // // let scale = this.scale
          // let exportSvg = svg.cloneNode(true) // .cloneNode(true)
          // // svg.setAttribute('transform', 'scale(3)')
          // /*
          // exportSvg.setAttribute('width', bBox.width * scale)
          // exportSvg.setAttribute('height', bBox.height * scale)
          // exportSvg.setAttribute('viewBox', `0 0 ${bBox.width * scale} ${bBox.height * scale}`)
          // exportSvg.setAttribute('transform', `scale(${scale})`)
          // */
          // console.log('export svg', exportSvg, svg, bBox)
          //
          // // let exportTest = document.querySelector('#debug')
          // // exportTest.appendChild(exportSvg)
          // saveSvgAsPng(exportSvg, 'diagram.png')
          // this.$store.commit('enableControls')
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
          // saveSvg(document.querySelector('svg'), 'diagram.svg')
          this.$store.dispatch('saveAsSvg')
        }
      }
    }
    </script>

    <style lang="scss" scoped>
    @import '~bootstrap-sass/assets/stylesheets/bootstrap/mixins/buttons';

    #debug {
      position: absolute;
      top: 500;
      left: 0;
      z-index: 1000;
    }
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

    .save-button-label {
        position: relative;
        display: inline-block;
        font-size: 0.5em;
        margin-left: -0.5em;
        /*top: -1.5em;*/
        background-color: #d4d6e9;
        color: black;
        padding: 0.2em;
        border-radius: 0.4em;
        /*transform: rotate(-45deg);
        transform-origin: 0;*/
        /*opacity: 0.8;*/
    }

/* Portrait and Landscape */
    // @media (screen)
    //   and (device-width: 320px)
    //   and (device-height: 640px)
    //   and (-webkit-device-pixel-ratio: 2) {
    //     .btn-responsive {
    //       /*button-size($padding-vertical, $padding-horizontal, $font-size, $line-height, $border-radius)*/
    //       @include button-size(1px, 5px, 12px, 1.5, 3px);
    //     }
    // }

    // @media (screen)
    //   and (max-width: 640px) {
    //   .btn-responsive {
    //     @include button-size(6px, 12px, 14px, 1.42857, 4px);
    //   }
    // }
    </style>
