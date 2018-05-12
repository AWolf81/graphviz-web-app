<template>
  <div class="container-fluid">
    <div class="row" v-if="user">
        <div class="well">
            <h1>Dashboard from {{user.username}}</h1>
            <h2>Cloud graphs</h2>
            <div v-if="loadingDotfiles">
              loading...
            </div>
            <div v-else>
              <div class="list-group" v-if="dotfiles && dotfiles.length > 0">
              <router-link :to="`/${dot.metadata.ghUser}/${dot.slug}`" 
                class="list-group-item" 
                v-for="dot in dotfiles" :key="dot['_id']">
                    <h3>{{dot.title}}</h3>
                    <p><span v-html="dot.content"></span>last modified: {{formatDate(dot.modified_at)}}</p>
                    <button class="btn btn-danger" @click.prevent="showDeleteConfirm(dot, true)">Delete</button>
                    Visibility: <visibility :visibility="dot.metadata.visibility" @toggle="toggleVisibility(dot.metadata.visibility)"/>
                    <!--<pre>{{dot}}</pre>-->
                </router-link>
              </div>
              <div class="alert alert-info" v-else>
                No graph saved yet.
              </div>
            </div>
            <h2>Local graphs</h2>
            <div class="list-group" v-if="storedGraphs.length > 0">
              <router-link class="list-group-item" :to="`/${graph.slug}`"
                v-for="(graph, key, index) in storedGraphs" :key="index">
                  <h3>{{graph.name}}</h3>
                  <p>{{formatDate(graph.createdAt)}}</p>
                  <button class="btn btn-danger" @click.prevent="showDeleteConfirm(graph)">Delete</button>
                </router-link>
            </div>
            <div class="alert alert-info" v-else>
                No graph saved yet.
            </div>
            <pre>{{JSON.stringify(dotfiles, null, 2)}}</pre>
        </div>
    </div>

    <!-- todo create Modal component for delete confirm - used at two locations -->
    <modal :show="showDelete" @cancel="cancelDelete" @ok="deleteGraph">
      <h4 slot="header">Delete graph</h4>
      <p slot="body">Are you sure to delete <strong>{{graphToDelete && (graphToDelete.name || graphToDelete.title)}}</strong>? (no undo possible)</p>
    </modal>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import modal from './Modal.vue'
import visibility from './Visibility.vue'
import axios from 'axios'
import {formatDate} from '../helpers/date'

export default {
  components: {
    modal,
    visibility
  },
  async created () {
    const {data} = await axios.get('/.netlify/functions/data')
    this.dotfiles = data.dotfiles
    this.loadingDotfiles = false
  },
  computed: {
    ...mapState({
      user: state => state.auth.user
    }),
    ...mapState([
      'showDelete',
      'graphToDelete',
      'storedGraphs'])
  },
  data () {
    return {
      dotfiles: undefined,
      loadingDotfiles: true
    }
  },
  methods: {
    formatDate,
    showDeleteConfirm (graph, cloud) {
      this.$store.commit('showDeleteConfirm', {graph, cloud})
    },
    ...mapMutations({
      cancelDelete: 'hideDeleteConfirm'
    }),
    ...mapActions(['changeVisibility']),
    deleteGraph () {
      this.$store.dispatch('triggerRemoveGraph').then(() => {
        if (this.graphToDelete.inCloud) {
          const dot = this.dotfiles.filter(dot => dot._id === this.graphToDelete._id)[0]
          const index = this.dotfiles.indexOf(dot)
          this.dotfiles.splice(index, 1)
        }
      }).catch((err) => console.log(err))
    },
    toggleVisibility (visibility) {
      const newVisibility = visibility === 'private' ? 'public' : 'private'
      this.changeVisibility({params: this.$route.params, newVisibility})
    }
  }
}
</script>
