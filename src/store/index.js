import Vue from "vue";
import VueLs from "vue-ls";
import Vuex from "vuex";
import panZoom from "./modules/panzoom";
import slugify from "@/helpers/slugify";
import router from "@/router";
import { DEFAULT_CODEMIRROR_THEME } from "@/App.constants";

Vue.use(Vuex);
Vue.use(VueLs);

export default new Vuex.Store({
  modules: {
    panZoom
  },
  state: {
    dotData:
      Vue.ls.get("draftDot") ||
      `digraph {
      node [shape=box]; ## changes all nodes
      a [shape=doublecircle]; ## changes only a
      ## a to b with -> as the connection
      a -> b;
      ## b to c and back to a
      b -> c -> a;
    }`,
    graphToDelete: undefined,
    editorTheme: Vue.ls.get("editorTheme") || DEFAULT_CODEMIRROR_THEME,
    showDelete: false,
    storedGraphs: Vue.ls.get("storedGraphs") || []
  },
  actions: {
    triggerRemoveGraph({ commit, state }) {
      if (state.graphToDelete) {
        commit("removeGraph", state.graphToDelete);
      }
      state.showDelete = false;
    }
  },
  mutations: {
    applyEditorTheme(state, theme) {
      state.editorTheme = theme;
      Vue.ls.set("editorTheme", theme);
    },
    hideDeleteConfirm(state) {
      state.showDelete = false;
      state.graphToDelete = undefined;
    },
    showDeleteConfirm(state, graph) {
      state.graphToDelete = graph;
      state.showDelete = true;
    },
    updateGraphData(state, graph) {
      state.dotData = graph.data; // used to update data from editor
      if (graph.data !== "") {
        // avoid clearing of draft
        Vue.ls.set("draftDot", graph.data); // always save as draft
      }
      if (graph.name || graph.name === "") {
        // name optional / empty to clear
        state.filename = graph.name;
      }
    },
    saveGraph(state, name) {
      let slug = slugify(name);
      // check if graph exists --> name for backwards compabitltiy
      let graph = state.storedGraphs.filter(
        graph => graph.slug === slug || graph.name === name
      );

      if (graph.length > 0) {
        // override graph
        let index = state.storedGraphs.indexOf(graph[0]);
        state.storedGraphs[index].slug = slug; // update slug
        state.storedGraphs[index].data = state.dotData;
      } else {
        // new graph
        state.storedGraphs.push({
          name,
          slug,
          id: state.storedGraphs.length,
          createdAt: Date.now(),
          data: state.dotData
        });
        // update route
        router.push({
          name: "Home",
          params: {
            slug
          }
        });
      }

      Vue.ls.set("storedGraphs", state.storedGraphs); // update storage
    },
    removeGraph(state, graph) {
      let index = state.storedGraphs.indexOf(graph);
      if (index === -1) return; // not in list

      state.storedGraphs.splice(index, 1); // remove
      Vue.ls.set("storedGraphs", state.storedGraphs); // update storage
    }
  }
});
