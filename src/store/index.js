import Vue from "vue";
import VueLs from "vue-ls";
import Vuex from "vuex";
import axios from "axios";
import panZoom from "./modules/panzoom";
import auth from "./modules/auth";
import slugify from "@/helpers/slugify";
import router from "@/router";
import { DEFAULT_CODEMIRROR_THEME } from "@/App.constants";

Vue.use(Vuex);
Vue.use(VueLs);

export default new Vuex.Store({
  modules: {
    panZoom,
    auth
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
    dotMeta: {
      ghUser: undefined,
      visibility: undefined // private or public for cloud stored dots
    },
    graphToDelete: undefined,
    editorTheme: Vue.ls.get("editorTheme") || DEFAULT_CODEMIRROR_THEME,
    showDelete: false,
    storedGraphs: Vue.ls.get("storedGraphs") || [],
    actionResponse: {
      status: undefined, // true if success, false on failed
      message: undefined // error message
    }
  },
  actions: {
    async triggerRemoveGraph({ commit, state }) {
      state.showDelete = false;
      if (state.graphToDelete && state.graphToDelete.inCloud) {
        // remove cloud graph
        // console.log('remove in cloud', state.graphToDelete)
        const slug = state.graphToDelete.slug;
        const user = state.auth.user.username;
        return axios.delete(`/.netlify/functions/data/${user}/${slug}`);
      } else {
        // local storage
        commit("removeGraph", state.graphToDelete);
      }
    },
    changeVisibility({ commit, state }, { params, newVisibility }) {
      // console.log('change vis', state.visibility, newVisibility)
      const oldVisibility = `${state.visibility}`;
      if (state.dotMeta.visibility === newVisibility) {
        return; // already set
      }
      // @todo --> check if other user wants to share public graph (no setting visibility required)
      commit("setVisibility", newVisibility); // set right away --> faster display
      let status = {
        dotfile: params
      };

      return axios
        .post("/.netlify/functions/data/", {
          params: params,
          visibility: newVisibility
        })
        .then(res => {
          console.log("changed vis", res);
          status = {
            ...status,
            status: true,
            message: "Successfully changed status"
          };
          commit("setActionResponse", status);
          return status;
        })
        .catch(error => {
          status = { ...status, status: false, message: error.message };
          // console.log(error) // todo check if we need to undo commit here
          commit("setVisibility", oldVisibility); // restore previous visibility --> as it is not applied at server
          commit("setActionResponse", status);
          return Promise.reject(status);
        });
    }
  },
  mutations: {
    applyEditorTheme(state, theme) {
      state.editorTheme = theme;
      Vue.ls.set("editorTheme", theme);
    },
    hideDeleteConfirm(state) {
      state.showDelete = false;
      // state.graphToDelete = undefined
    },
    showDeleteConfirm(state, { graph, cloud }) {
      state.graphToDelete = {
        ...graph,
        inCloud: cloud
      };
      state.showDelete = true;
    },
    setVisibility(state, newVisibility) {
      Vue.set(state.dotMeta, "visibility", newVisibility);
    },
    setActionResponse(state, { status, message }) {
      Vue.set(state.actionResponse, "status", status);
      Vue.set(state.actionResponse, "message", message);
    },
    updateGraphData(state, { data, name, initialLoad, visibility, ghUser }) {
      state.dotData = data; // used to update data from editor
      Vue.set(state, "dotMeta", {
        visibility,
        ghUser
      });

      if (data !== "" && !initialLoad) {
        // avoid clearing of draft & avoid overwriting draft on cloud load
        Vue.ls.set("draftDot", data); // always save as draft
      }
      if (name || name === "") {
        // name optional / empty to clear
        // console.log('new filename', graph.name)
        state.filename = name;
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
