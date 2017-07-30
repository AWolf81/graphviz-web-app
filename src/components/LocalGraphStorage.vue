<template lang="html">
  <dropdown v-if="graphs.length > 0" @show="triggerNanoscroller">
    <span slot="trigger">Load <span class="caret"></span></span>
    <div class="dropdown-menu">
      <div class="nano">
        <div class="nano-content">
          <!-- <div class="dropdown-menu"> -->
            <div v-for="graph in graphs">
              <div class="media load-item">
                <h4 class="media-heading">{{graph.name}}</h4>
                <button class="btn btn-xs" @click="show(graph)">show</button>
                <button class="btn btn-xs btn-danger" @click="showDeleteConfirm(graph)">delete</button>
                <div class="media-footer">created at {{formatData(graph.createdAt)}}</div>
              </div>
            </div>
          <!-- </div> -->
        </div>
      </div>
    </div>
  </dropdown>
</template>

<script>
import moment from 'moment'
import {mixin as clickaway} from 'vue-clickaway'
import dropdown from '@/components/Dropdown.vue'
import modal from '@/components/Modal.vue'
import $ from 'jquery'
import 'nanoscroller'

export default {
  components: {
    dropdown,
    modal
  },
  data () {
    return {
      graphToDelete: undefined
    }
  },
  props: ['graphs'],
  methods: {
    formatData (date) {
      return moment(date).format('YYYY-MM-DD HH:m:s')
    },
    show (graph) {
      console.log('show graph', graph.name)
      if (graph.slug) {
        this.$router.push({name: 'Home',
          params: {
            slug: graph.slug
          }})
        // new stored data will be with slug
        return
      }

      // below is kept to be backwards compatible
      if (this.$route.name !== 'Home') {
        console.log('redirect', this.$route.name)
        // ensure that we're having the correct view
        this.$router.push('/')
      }
      //
      this.$store.commit('updateGraphData', graph)
      this.showLoadDropdown = false
    },
    showDeleteConfirm (graph) {
      this.$store.commit('showDeleteConfirm', graph)
    },
    triggerNanoscroller () {
      console.log('trigger scroller')
      setTimeout(() =>
        $('.nano').nanoScroller({ flash: true })
      , 50)
    }
  },
  mixins: [clickaway]
}
</script>

<style lang="css">
  .dropdown-menu {
    width: 20em;
    padding: 0.5em;
    max-height: 80vh;
    overflow-y: auto;
  }

  .load-item {
    padding-bottom: 0.5em;
    border-bottom: 1px solid #cccccc;
    margin-bottom: 0.2em;
  }
</style>
