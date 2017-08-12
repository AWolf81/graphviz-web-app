<template lang="html">
  <div class="container-fluid">
      <spinner v-if="!loaded"></spinner>
      <alert v-if="loaded" id="appInfo" alert-type="cookie-info-alert">
        <strong>DrawViz</strong> is using Graphviz to create a graph from a specification written as text. <br/>
            It's like markdown but for creating graphs.
            Check-out the links <router-link to="/about">here</router-link> or the examples to learn more about it.
          <p><small>This app is using cookies for user traffic tracking. By closing this message you're accepting the usage. Don't like tracking - click <a href="javascript:gaDisableTracking()">here</a> to disable.</small></p>
      </alert>
      <div class="row" v-if="loaded">
        <div class="col-md-4" v-if="!isMaximizedRender">
          <nav class="navbar navbar-default">
              <div class="navbar-header pull-left">
                <a class="navbar-brand">Definition</a>
              </div>
              <div class="navbar-header pull-right">
              <div class="btn-group navbar-btn" role="group" aria-label="toolbar">
                <button type="button" @click="clear()" title="Clear graph data input" class="btn btn-small btn-default">
                  <span class="glyphicon glyphicon-trash"></span></button>
                  <button type="button" :disabled="!localDotData"
                  :title="!localDotData? 'Nothing to save!': 'Save your graph in browser'"
                  @click="openSave()" class="btn btn-small btn-default">
                  <span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span></button>
                  <dropdown trigger-tag="span" class="btn btn-small btn-default dropdown-toggle">
                    <span slot="trigger"
                    title="Save as"
                    aria-hidden="true"><span class="glyphicon glyphicon-floppy-disk"></span>...</span>
                    <div class="dropdown-menu pull-right">
                      <div class="list-group">
                        <a href="#" class="list-group-item" @click.prevent="saveTxt">
                          Download textfile
                        </a>
                      </div>
                    </div>
                  </dropdown>
                </div>
              </div>
            </nav>
            <div v-if="renderErrorMessage!=''" class="render-error"><small>{{renderErrorMessage}}</small>
            </div>
            <!-- <textarea class="form-control" v-model="dotData"></textarea> -->
            <codemirror :value="localDotData" @change="updateDot" :options="editorOption" @ready="onEditorReady"></codemirror>
            <nav class="navbar navbar-default" role="navigation">
              <ul class="nav navbar-nav">
                <theme-select></theme-select>
              </ul>
            </nav>
          </div>
          <div :class="{'col-md-12': isMaximizedRender, 'col-md-8': !isMaximizedRender}">
            <nav class="navbar navbar-default">
                <div class="navbar-header pull-left">
                  <a class="navbar-brand">Render
                  </a>
                  <button class="btn btn-default btn-xs navbar-btn" @click="toggleSize" title="Toggle size"><i :class="`glyphicon ${isMaximizedRender? 'glyphicon-resize-small': 'glyphicon-resize-full'}`"></i></button>
                </div>
                <!-- <div class="btn-group navbar-right">
                  <button type="button" name="button" class="btn btn-default navbar-btn">1</button>
                  <button type="button" name="button" class="btn btn-default navbar-btn">2</button>
                </div> -->
                <div class="navbar-header pull-right">
                  <export-tools></export-tools>
                </div>
            </nav>
            <graph-viz-render
              :dot-data="localDotData"
              @error="updateError"></graph-viz-render>
          </div>
        </div>
        <!-- <footer>Examples from <a href="http://www.graphviz.org/Gallery.php" target="_blank">http://www.graphviz.org/Gallery.php</a></footer> -->
      <!-- </div> -->

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

<modal :show="showDelete" @cancel="cancelDelete" @ok="deleteGraph">
  <h4 slot="header">Delete graph</h4>
  <p slot="body">Are you sure to delete <strong>{{graphToDelete ? graphToDelete.name : ''}}</strong>? (no undo possible)</p>
</modal>
<!-- <modal title="Clear editor" :show.sync="showClear" @ok="ok" @cancel="cancel">
Are you sure to clear the editor? (no undo)
</modal> -->
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import {mapState, mapMutations} from 'vuex'
import _ from 'lodash'
import { codemirror } from 'vue-codemirror'
import themeSelect from './CodeMirrorThemeSelect.vue'
import { examples } from './../App.constants'
import dropdown from './Dropdown'
import graphVizRender from './GraphVizRender.vue'
import exportTools from './ExportTools.vue'
import modal from './Modal.vue'
import spinner from './Spinner.vue'
import alert from './Alert.vue'

import '@/helpers/loadCodemirrorThemes.js'

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
      currentTheme: '',
      // localDotData: '',
      editorOption: {
        tabSize: 2,
        gutters: ['CodeMirror-linenumbers', 'markers'],
        viewportMargin: Infinity,
        lineWrapping: false
        // scrollbarStyle: 'null'
      },
      isMaximizedRender: false
    }
  },
  components: {
    alert,
    codemirror,
    dropdown,
    exportTools,
    graphVizRender,
    modal,
    spinner,
    themeSelect
  },
  computed: {
    ...mapState({
      localDotData: (state) => state.dotData
    }),
    ...mapState(['editorTheme', 'filename', 'graphToDelete', 'storedGraphs', 'showDelete'])
  },
  watch: {
    // localDotData: _.debounce(() => {
    //   this.$store.commit('updateDotData', this.localDotData)
    // }, 500),
    editorTheme () {
      this.setTheme(this.editorTheme)
    },
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
    console.log('graphviz editor', this.$editor, this.$route)
    // this.loadStorage()
    this.setData()
    console.log(this.$route, this) // todo check if id passed & route example
  },
  methods: {
    ...mapMutations([
      'updateGraphData'
    ]),
    cancelDelete () {
      this.$store.commit('hideDeleteConfirm')
    },
    setTheme (theme) {
      // editor maybe not ready here (first set in onEditorReady)
      if (this.$editor) {
        this.$editor.setOption('theme', this.editorTheme)
      }
    },
    deleteGraph () {
      this.$store.dispatch('triggerRemoveGraph')
    },
    updateDot: _.debounce(function (data) { this.updateGraphData({data: data}) }, 500),
    onEditorReady () {
      this.$editor = document.querySelector('.CodeMirror').CodeMirror

      console.log('editor ready', this.$editor)
      this.$editor.setOption('theme', this.editorTheme)
    },
    clearGutter (name) {
      this.$editor.clearGutter(name)
    },
    highlightLine (lineNumber) {
      // Line number is zero based index
      let actualLineNumber = lineNumber - 1

      // Select the first item (zero index) just incase more than one found & get the CodeMirror JS object
      let codeMirrorEditor = this.$editor

      // Write the item to the console window, for debugging
      console.log(this.$editor, actualLineNumber)

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
    saveTxt () {
      console.log('save file...')
      this.setFilename()
      let element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' +
        encodeURIComponent(this.localDotData.replace(/([^\r])\n/g, '$1\r\n')))
      element.setAttribute('download', (this.saveName || 'dotdata') + '.txt')

      element.style.display = 'none'
      document.body.appendChild(element)

      element.click()

      document.body.removeChild(element)
    },
    setData () {
      // if (this.$route.name !== 'Home') {
      // not home --> check if index exists and render
      let index = this.$route.params.index
      let example = examples[index]

      if (!isNaN(index)) {
        // numeric value --> example from index
        if (example.data) {
          // this.localDotData = example.data
          this.updateGraphData({data: example.data})
          this.loaded = true
        } else {
          this.loadData(example.url).then(data => {
            // this.localDotData = data
            this.updateGraphData({data})
            this.loaded = true
          })
        }
      } else {
        // not a name
        let url = this.$route.query.url
        // console.log('load from url', url)
        if (url) {
          // defined but a string --> use url params to load data
          console.log(this.$route)
          this.loadData(url).then(data => {
            this.localDotData = data
            this.loaded = true
          }).catch((err) => {
            this.errorMessage = err.message
            this.showError = true
          })
        } else {
          if (this.$route.name === 'Home') {
            // console.log('home route', this.$route)
            if (this.$route.params.slug) {
              let graph = this.storedGraphs
                .filter((graph) => graph.slug === (this.$route.params.slug))[0]
              if (!graph) {
                this.errorMessage = "Couldn't load data. Please check your url."
                this.showError = true
                this.loaded = true
                return
              }
              this.localDotData = graph.data
              this.$store.commit('updateGraphData', graph)
              // console.log('loaded graph', graph)
            } else {
              this.localDotData = this.$store.state.dotData // initial load data
            }
            this.loaded = true
          } else {
            // show error
            console.log('loaded')
            this.errorMessage = "Couldn't load data. Please check your url."
            this.showError = true
            this.loaded = true
          }
        }
      }
      // } else {
      //   // home route --> set loaded to display editors
      //   this.loaded = true
      // }
    },
    openSave () {
      this.setFilename()
      this.showSave = true
    },
    setFilename () {
      this.saveName = this.filename
      console.log('set filename', this.filename, this.saveName)
    },
    toggleSize () {
      this.isMaximizedRender = !this.isMaximizedRender
      setTimeout(() =>
        this.$store.commit('updateSVGSize', document.querySelector('svg').getBBox())
      , 0)
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
      return axios.get(`https://cors-anywhere.herokuapp.com/${url}`)
      .then((response) => response.data)
      .catch((response) => {
        console.log('response', response)
        this.errorMessage = response.message + ' - Please try again later.'
        this.showError = true
      })
    },
    // loadStorage () {
    //   this.storedGraphs = this.$ls.get('storedGraphs') || []
    // },
    clear () {
      // show modal
      console.log('clear clicked')
      this.showClear = true
      console.log(this.showClear)
    },
    ok () {
      // this.localDotData = ''
      this.updateGraphData({data: '', name: ''})
      this.showClear = false
      this.$router.push('/')
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
      this.$store.commit('saveGraph', name)
    }
    /* show (index) {
    let data = this.examples[index].data
    if (!data) {
    let example = this.examples[index] // short hand
    this.loadData(example.url).then((loadedData) => {
    this.localDotData = loadedData
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

.dropdown-menu > .list-group {
  margin-bottom: 0px;
}
/*.dropdown-menu {
  overflow: hidden;
  height: 300px;
}*/

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

.CodeMirror-scroll {
  height: auto;
  overflow-y: hidden;
  overflow-x: scroll;
}

.CodeMirror {
  border: 1px solid #eee;
  height: auto !important;
}

.CodeMirror pre {
  z-index: 0 !important;
}

.render-error {
  position: relative;
  text-align: center;
  color: #a94442;
  margin-top: -20px;
}

</style>
