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
      <div id="exportSVG" class="">
      </div>
    </div>
</template>

    <script>
    import _ from 'lodash'
    import {mixin as clickaway} from 'vue-clickaway'
    import {saveSvgAsPng, saveSvg} from 'save-svg-as-png'
    // import {saveSvg} from 'save-svg-as-png'
    import { DEFAULT_EXPORT_NAME } from '@/App.constants'
    export default {
      mixins: [clickaway],
      computed: {
        name () {
          // console.log('name', this.$route, this.$route.path.length)
          // if there is no name in path just '/' -- fallback to default name
          return this.$route.path.length > 1
            ? this.$route.path.replace('/', '')
            : DEFAULT_EXPORT_NAME
        }
      },
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
      methods: {
        createExportSvg () {
          let graph = document.querySelector('.graph').cloneNode(true) // svg
          let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
          svg.appendChild(graph)

          let exportArea = document.querySelector('#exportSVG svg')
          if (!exportArea) {
            document.querySelector('#exportSVG').appendChild(svg)
          } else {
            exportArea.replaceWith(svg)
          }
          let graphBox = graph.getBoundingClientRect() // .getClientRects()[0] // getBBox()
          console.log('graphbox', graphBox)
          svg.setAttribute('width', this.scale * graphBox.width)
          svg.setAttribute('height', this.scale * graphBox.height)
          svg.setAttribute('viewBox', `0 0 ${this.scale * graphBox.width} ${this.scale * graphBox.height}`)
          svg.setAttribute('transform', `scale(${this.scale})`)
          console.log('svg size', graphBox.width, graphBox.height, svg.getBoundingClientRect())
          return graphBox // svg.getClientRects()[0] // getBoundingClientRect() // getClientRects()[0]
        },
        hideDropdown () {
          console.log('hide')
          this.showExportSettings = false
          if (document.querySelector('#exportSVG svg')) {
            document.querySelector('#exportSVG svg').outerHTML = ''
          }
        },
        displaySize () {
          let size = this.createExportSvg()          //
          // console.log(svg)
          // var bbox = svg.getBBox()
          // svg.setAttribute('width', bbox.x + bbox.width + 'px')
          // svg.setAttribute('height', bbox.y + bbox.height + 'px')
          // let size = svg.getBBox() // getClientRects()[0] // getBoundingClientRect() // getClientRects()[0]
          // console.log('graph cloned', svg)
          // console.log('display size', svg.transform, size, this.scale, svg.getClientRects())
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
        save (cb) {
          this.createExportSvg() // creates export image
          let svg = document.querySelector('#exportSVG svg')
          cb(svg)
          svg.outerHTML = ''
        },
        savePNG () {
          // console.log(this.name)
          this.save((svg) =>
            saveSvgAsPng(svg, this.name + '.png'))
        },
        saveSVG () {
          this.save((svg) =>
            saveSvg(document.querySelector('svg'), this.name + '.svg'))
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

    #exportSVG {
      /* hidden export area (used for size calculation & exporting)*/
      // display: none;
      position: absolute;
      opacity: 0;
      top: 0;
      left: 0;
      z-index: -1; /* behind render area */
      /* svg background white / not transparent --> exort svg is invisble */
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
