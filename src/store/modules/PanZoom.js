import svgPanZoom from 'svg-pan-zoom'
import store from '../index.js'

// function onResize () {
//   this.panZoom.fit()
//   this.panZoom.center()
//   this.panZoom.resize()
// }

function onPan (newPan) {
  console.log(this, newPan)
  store.commit('updatePan', newPan)
  // this.state.panPos = newPan
}

function onZoom (newZoom) {
  console.log(this, newZoom)
  // this.zoomPos = newZoom77
  store.commit('updateZoom', newZoom)
  // this.state.panZoom = newZoom
}

export default {
  state: {
    instance: undefined,
    panPos: undefined,
    zoomPos: undefined,
    backupPanZoom: {
      // pan / zoom backup for export
    },
    controlsVisible: true
  },
  mutations: {
    createPanZoom (state) {
      // svg must be rendered before!!!
      // re-created after each render

      let svgElement = document.querySelector('svg')

      if (!svgElement) return

      let panZoom = state.instance = svgPanZoom(svgElement, {
        // viewportSelector: '.render-wrapper'
        zoomEnabled: true,
        controlIconsEnabled: true,
        fit: true,
        center: true,
        minZoom: 0.1,
        onZoom: onZoom,
        onPan: onPan,
        onUpdatedCTM: () => {
          state.controlsVisible = panZoom.isControlIconsEnabled()
        }
      })
      //
      panZoom.resize() // update SVG cached size and controls positions
      // panZoom.fit()
      // panZoom.center()

      // register resize handler
      // window.onresize = onResize
    },
    disableControls (state) {
      let panZoom = state.instance
      console.log('disableControls', panZoom)
      panZoom.resize()
      panZoom.disableControlIcons()
      state.controlsVisible = false
      // panZoom.disablePan()
      // panZoom.disableZoom()
    },
    enableControls (state) {
      let panZoom = state.instance
      panZoom.enableControlIcons()
      state.controlsVisible = true
      // panZoom.enablePan()
      // panZoom.enableZoom()
    },
    updatePan (state, newPan) {
      state.panPos = newPan
    },
    updateZoom (state, newZoom) {
      state.zoomPos = newZoom
    },
    resetZoom (state) {
      let panZoom = state.instance
      state.backupPanZoom = {
        panPos: state.panPos,
        zoomPos: state.zoomPos
      }
      // panZoom.updateBBox()
      panZoom.resize()
      panZoom.fit()
      panZoom.center()
      panZoom.resetZoom()
    },
    restoreZoom (state) {
      let panZoom = state.instance
      if (state.backupPanZoom) {
        if (!isNaN(state.backupPanZoom.panPos.x)) {
          panZoom.pan(state.backupPanZoom.panPos)
        }
        if (state.backupPanZoom.zoomPos) {
          panZoom.zoom(state.backupPanZoom.zoomPos)
        }
      }
    }
  }
}
