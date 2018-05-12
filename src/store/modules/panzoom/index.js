import svgPanZoom from 'svg-pan-zoom'
import store from '@/store'
// import {saveSvgAsPng, saveSvg} from 'save-svg-as-png'

import eventsHandler from './EventsHandler'

function onResize () {
  // console.log('resized')
  let panZoom = store.state.panZoom.instance
  setTimeout(() => {
    // delayed for maximize event
    // panZoom.fit()
    // panZoom.center()
    panZoom.reset()
    panZoom.resize()
    // console.log('updated panZoom')
    // store.commit('updateSVGSize', document.querySelector('svg').getBBox())
  }, 500)
}

function onPan (newPan) {
  // console.log(this, newPan)
  store.commit('updatePan', newPan)
}

function onZoom (newZoom) {
  // console.log(this, newZoom)
  store.commit('updateZoom', newZoom)
}

export default {
  state: {
    instance: undefined,
    panPos: undefined,
    zoomPos: undefined,
    size: undefined
  },
  actions: {
    triggerPanzommResize () {
      onResize()
    }
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
        customEventsHandler: eventsHandler
      })
      //
      panZoom.resize() // update SVG cached size and controls positions
      // panZoom.fit()
      // panZoom.center()
      // register resize handler
      window.onresize = onResize
    },
    updateSVGSize (state, size) {
      state.size = size
      state.instance.resize()
    },
    disableControls (state) {
      let panZoom = state.instance
      // console.log('disableControls', panZoom)
      panZoom.resize()
      panZoom.disableControlIcons()
    },
    enableControls (state) {
      let panZoom = state.instance
      panZoom.enableControlIcons()
    },
    updatePan (state, newPan) {
      state.panPos = newPan
    },
    updateZoom (state, newZoom) {
      state.zoomPos = newZoom
    }
  }
}
