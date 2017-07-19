<template lang="html">
  <div>
    <h1>Graphviz App</h1>
    <div class="container">
      <h4>
        Examples
      </h4>

      <div class="btn-group" role="group" aria-label="Example selection bar">
        <!-- <button type="button" class="btn btn-default" @click="show(index)" v-for="(example, index) in examples"> -->
        <router-link class="btn btn-xs btn-default" :to="'/example/' + index" v-for="(example, index) in examples" :key="'example-link' + index">
          {{example.caption}}
        </router-link>
      </div>
      <local-graph-storage :graphs="storedGraphs" @show="showStored" @remove="removeGraph"></local-graph-storage>

      <hr/>
      <div v-if="!loaded">
        <spinner></spinner>
      </div>
      <div class="row" v-if="loaded">
        <div class="col-md-4">
          <nav class="navbar navbar-default">
            <div class="container-fluid">
              <div class="navbar-header">
                <a class="navbar-brand">Definition</a>
              </div>
              <div class="btn-group navbar-btn navbar-right" role="group" aria-label="toolbar">
                <button type="button" @click="clear()" title="Clear graph data input" class="btn btn-small btn-default">
                  <span class="glyphicon glyphicon-trash"></span></button>
                  <button type="button" :disabled="!dotData"
                  :title="!dotData? 'Nothing to save!': 'Save your graph in browser'"
                  @click="showSave=true" class="btn btn-small btn-default">
                  <span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span></button>
                </div>
              </div>
            </nav>
            <div v-if="renderErrorMessage!=''" class="render-error"><small>{{renderErrorMessage}}</small>
            </div>
            <!-- <textarea class="form-control" v-model="dotData"></textarea> -->
            <codemirror v-model="dotData" :options="editorOption" @ready="onEditorReady"></codemirror>
          </div>
          <div class="col-md-8">
            <nav class="navbar navbar-default">
              <div class="container-fluid">
                <div class="navbar-header">
                  <a class="navbar-brand">Render</a>
                </div>
                <!-- <div class="btn-group navbar-right">
                  <button type="button" name="button" class="btn btn-default navbar-btn">1</button>
                  <button type="button" name="button" class="btn btn-default navbar-btn">2</button>
                </div> -->
                <export-tools></export-tools>
              </div>
            </nav>
            <graph-viz-render
              :dot-data="dotData"
              @error="updateError"></graph-viz-render>
          </div>
        </div>
        <footer>Examples from <a href="http://www.graphviz.org/Gallery.php" target="_blank">http://www.graphviz.org/Gallery.php</a></footer>
      </div>

      <modal :show.sync="showClear" @cancel="cancel" @ok="ok">
        <h4 slot="header">Clear editor</h4>
        <p slot="body">Are you sure? (no undo)</p>
        <!-- <div slot="footer">
        <button class="modal-default-button btn-danger" @click="cancel">
        Yes
      </button>
      <button class="modal-default-button" @click="ok">
      No
    </button>
  </div>-->
</modal>

<modal :show="showSave" @cancel="cancelSave" @ok="performSave(saveName)">
  <h4 slot="header">Save graph in browser</h4>
  <form slot="body" @submit.prevent="performSave(saveName)">
    <div class="form-group">
      <label>Please enter a name for your graph</label>
      <input type="text" class="form-control"
      v-model="saveName" v-focus>
    </div>
  </form>
</modal>

<modal :show="showError" @cancel="hideError" @ok="hideError">
  <h4 slot="header">Error occured</h4>
  <p slot="body">{{errorMessage}}</p>
</modal>
<!-- <modal title="Clear editor" :show.sync="showClear" @ok="ok" @cancel="cancel">
Are you sure to clear the editor? (no undo)
</modal> -->
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import { codemirror } from 'vue-codemirror'

import { examples } from './../App.constants'
import localGraphStorage from './LocalGraphStorage.vue'
import graphVizRender from './GraphVizRender.vue'
import exportTools from './ExportTools.vue'
import modal from './Modal.vue'
import spinner from './Spinner.vue'

Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted (el) {
    // Focus the element (if visible)
    // console.log('inserted', el)
    el.focus()
  },
  componentUpdated (el) {
    // support to focus in modal
    // console.log('updated', el)
    el.focus()
  }
})

export default {
  data () {
    return {
      $editor: undefined,
      loaded: false,
      showClear: false,
      showSave: false,
      showError: false,
      errorMessage: '', // app errors
      renderErrorMessage: '', // e.g. syntax error for dot
      saveName: undefined,
      saveReady: false,
      controlIconsEnabled: true,
      dotData:
      `digraph {
        node [shape=box]; ## changes all nodes
        a [shape=doublecircle]; ## changes only a
        ## a to b with -> as the connection
        a -> b;
        ## b to c and back to a
        b -> c -> a;
      }`,
      storedGraphs: [],
      examples,
      editorOption: {
        tabSize: 2,
        gutters: ['CodeMirror-linenumbers', 'markers'],
        viewportMargin: Infinity
      }
    }
  },
  components: {
    graphVizRender,
    localGraphStorage,
    modal,
    codemirror,
    exportTools,
    spinner
  },
  watch: {
    renderErrorMessage () {
      let line = parseInt(this.renderErrorMessage.match(/\d+/))

      if (this.renderErrorMessage === '') {
        this.clearGutter('markers')
        return
      }

      if (line) {
        this.highlightLine(line)
      }
    }
  },
  mounted () {
    console.log('graphviz editor', this.$editor)
    this.loadStorage()
    this.setData()
    console.log(this.$route, this) // todo check if id passed & route example
  },
  methods: {
    onEditorReady () {
      this.$editor = document.querySelector('.CodeMirror')
    },
    clearGutter (name) {
      this.$editor.CodeMirror.clearGutter(name)
    },
    highlightLine (lineNumber) {
      // Line number is zero based index
      let actualLineNumber = lineNumber - 1

      // Select the first item (zero index) just incase more than one found & get the CodeMirror JS object
      let codeMirrorEditor = this.$editor.CodeMirror

      // Write the item to the console window, for debugging
      console.log(this.$editor.CodeMirror, actualLineNumber)

      this.clearGutter('markers') // clear previous marker

      // Set line CSS class to the line number & affecting the background of the line with the css class of line-error
      // codeMirrorEditor.setLineClass(actualLineNumber, 'background', 'line-error')
      codeMirrorEditor.setGutterMarker(actualLineNumber, 'markers', this.makeMarker())
    },
    makeMarker () {
      var marker = document.createElement('div')
      marker.style.color = '#822'
      marker.innerHTML = `<span title="${this.renderErrorMessage}">●</span>`
      return marker
    },
    setData () {
      if (this.$route.name !== 'Home') {
        // not home --> check if index exists and render
        let index = this.$route.params.index
        let example = this.examples[index]

        if (!isNaN(index)) {
          // numeric value --> example from index
          if (example.data) {
            this.dotData = example.data
            this.loaded = true
          } else {
            this.loadData(example.url).then(data => {
              this.dotData = data
              this.loaded = true
            })
          }
        } else {
          let url = this.$route.query.url
          console.log('load from url', url)
          if (url) {
            // defined but a string --> use url params to load data
            console.log(this.$route)
            this.loadData(url).then(data => {
              this.dotData = data
              this.loaded = true
            }).catch((err) => {
              this.errorMessage = err.message
              this.showError = true
            })
          } else {
            // show error later
            this.errorMessage = "Couldn't load data. Please check your url."
            this.showError = true
          }
        }
      } else {
        // home route --> set loaded to display editors
        this.loaded = true
      }
    },
    // render error updating
    updateError (error) {
      console.log('new error', error, this)
      this.renderErrorMessage = error
    },
    hideError () {
      this.showError = false
      this.errorMessage = ''
    },
    loadData (url) {
      return axios.get(`https://crossorigin.me/${url}`)
      .then((response) => response.data)
    },
    loadStorage () {
      this.storedGraphs = this.$ls.get('storedGraphs') || []
    },
    clear () {
      // show modal
      console.log('clear clicked')
      this.showClear = true
      console.log(this.showClear)
    },
    ok () {
      this.dotData = ''
      this.showClear = false
    },
    cancel () {
      // clear cancelled
      this.showClear = false
    },
    performSave (name) {
      console.log('save', name)
      if (!name) {
        this.errorMessage = 'Please enter a name for your graph'
        this.showError = true
        // this.showSave = false // keep save displayed
        return
      }

      this.save(name)
      this.showSave = false
    },
    cancelSave () {
      this.showSave = false
    },
    save (name) {
      let graph = this.storedGraphs.filter((graph) => graph.name === name)

      if (graph.length > 0) {
        // override graph
        let index = this.storedGraphs.indexOf(graph[0])
        this.storedGraphs[index].data = this.dotData
      } else {
        // new graph
        this.storedGraphs.push({
          name,
          id: this.storedGraphs.length,
          createdAt: Date.now(),
          data: this.dotData
        })
      }

      Vue.ls.set('storedGraphs', this.storedGraphs)
    },
    showStored (data) {
      this.dotData = data
    },
    removeGraph (graph) {
      let index = this.storedGraphs.indexOf(graph)
      if (index === -1) return // not in list

      this.storedGraphs.splice(index, 1) // remove
      this.$ls.set('storedGraphs', this.storedGraphs) // update storage
    }
    /* show (index) {
    let data = this.examples[index].data
    if (!data) {
    let example = this.examples[index] // short hand
    this.loadData(example.url).then((loadedData) => {
    this.dotData = loadedData
    this.loaded = true
  })
} else {
this.dotData = this.examples[index].data
this.loaded = true
}
} */
  }
}
</script>

<style lang="css">
.navbar-default {
  margin-bottom: 0;
}

.navbar .btn-group {
  padding-right: 0.5em;
}
a.router-link-active, li.router-link-active a {
  color: #fff;
  background-color: #337ab7;
}

/* CodeMirror styles */
.line-error {
  background: #FBC2C4 !important;
  color: #8a1f11 !important;
}

.markers {
  width: 10px;
}

/*.CodeMirror-scroll {
  height: auto;
  overflow-y: hidden;
  overflow-x: auto;
}*/

.CodeMirror {
  border: 1px solid #eee;
  height: auto;
}

.render-error {
  position: relative;
  text-align: center;
  color: #a94442;
  margin-top: -20px;
}
</style>
