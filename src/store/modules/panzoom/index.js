import svgPanZoom from 'svg-pan-zoom'
import store from '@/store'
import {saveSvgAsPng, saveSvg} from 'save-svg-as-png'

import eventsHandler from './EventsHandler'

function onResize () {
  console.log('resized')
  let panZoom = store.state.panZoom.instance
  setTimeout(() => {
    // delayed for maximize event
    // panZoom.fit()
    // panZoom.center()
    panZoom.reset()
    panZoom.resize()
    console.log('updated panZoom')
    // store.commit('updateSVGSize', document.querySelector('svg').getBBox())
  }, 500)
}

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

function save (cb) {
  console.log('saving svg as png')
  let panZoomInstance = store.state.panZoom.instance
  let savedZoom = panZoomInstance.getZoom()
  let savedPan = panZoomInstance.getPan()

  panZoomInstance.disableControlIcons()
  panZoomInstance.resetZoom()
  // panZoomInstance.resetPan()
  panZoomInstance.pan({x: 0, y: 0})

  // console.log('svg prepared', document.querySelector('svg'))
  setTimeout(() => {
    let svg = document.querySelector('svg')
    let bBox = svg.getBBox()

    // a bit hacky, but with-out it the size was incorrect
    svg.setAttribute('width', bBox.width + bBox.x)
    svg.setAttribute('height', bBox.height + bBox.y)

    console.log('svg to save', bBox, svg.getBBox())
    cb(svg)
    panZoomInstance.zoom(savedZoom)
    panZoomInstance.pan(savedPan)
    panZoomInstance.enableControlIcons()
  }, 1000)
}

export default {
  state: {
    instance: undefined,
    panPos: undefined,
    zoomPos: undefined,
    size: undefined
  },
  actions: {
    saveAsSvg ({commit, state}) {
      save((svg) => {
        // svg save callback
        saveSvg(svg, 'diagram.svg')
      })
    },
    saveAsPng ({commit, state}, scale) {
      // commit
      save((svg) => {
        // png save callback
        saveSvgAsPng(svg, 'svg.png', {scale})
      })
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
      console.log('disableControls', panZoom)
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
