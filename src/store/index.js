import Vue from 'vue'
import VueLs from 'vue-ls'
import Vuex from 'vuex'
import panZoom from './modules/panzoom'

Vue.use(Vuex)
Vue.use(VueLs)

export default new Vuex.Store({
  modules: {
    panZoom
  },
  state: {
    dotData: `digraph {
      node [shape=box]; ## changes all nodes
      a [shape=doublecircle]; ## changes only a
      ## a to b with -> as the connection
      a -> b;
      ## b to c and back to a
      b -> c -> a;
    }`,
    storedGraphs: Vue.ls.get('storedGraphs') || [],
    collapseInactive: true
  },
  mutations: {
    updateDotData (state, dot) {
      state.dotData = dot
    },
    saveGraph (state, name) {
      let graph = state.storedGraphs.filter((graph) => graph.name === name)

      if (graph.length > 0) {
        // override graph
        let index = state.storedGraphs.indexOf(graph[0])
        state.storedGraphs[index].data = state.dotData
      } else {
        // new graph
        state.storedGraphs.push({
          name,
          id: state.storedGraphs.length,
          createdAt: Date.now(),
          data: state.dotData
        })
      }

      Vue.ls.set('storedGraphs', state.storedGraphs) // update storage
    },
    removeGraph (state, graph) {
      let index = state.storedGraphs.indexOf(graph)
      if (index === -1) return // not in list

      state.storedGraphs.splice(index, 1) // remove
      Vue.ls.set('storedGraphs', state.storedGraphs) // update storage
    },
    updateNavCollapseInactive (state, inactive) {
      state.collapseInactive = inactive
    }
  }
})
