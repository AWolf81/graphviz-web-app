import Vue from 'vue'
import Vuex from 'vuex'
import panZoom from './modules/PanZoom'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    panZoom
  },
  state: {
  }
})
