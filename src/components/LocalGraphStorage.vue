<template lang="html">
  <li v-if="graphs.length > 0" class="dropdown" :class="{open: showLoadDropdown}">
    <a href="#" @click="showLoadDropdown = !showLoadDropdown"class="dropdown-toggle" title="Load from localstorage">Load <span class="caret"></span></a>
    <ul class="dropdown-menu" id="scrollbar-style" v-if="showLoadDropdown" v-on-clickaway="() => {showLoadDropdown = false}">
      <li v-for="graph in graphs">
        <div class="media">
          <h4 class="media-heading">{{graph.name}}</h4>
          <button class="btn btn-xs" @click="show(graph.data)">show</button>
          <button class="btn btn-xs btn-danger" @click="$emit('remove', graph)">delete</button>
          <div class="media-footer">created at {{formatData(graph.createdAt)}}</div>
        </div>
      </li>
    </ul>
  </li>
</template>

<script>
import moment from 'moment'
import {mixin as clickaway} from 'vue-clickaway'

export default {
  data () {
    return {
      showLoadDropdown: false
    }
  },
  props: ['graphs'],
  methods: {
    formatData (date) {
      return moment(date).format('YYYY-MM-DD HH:m:s')
    },
    show (data) {
      if (this.$route.name !== 'Home') {
        console.log('redirect', this.$route.name)
        // ensure that we're having the correct view
        this.$router.push('/')
      }

      this.$store.commit('updateDotData', data)
      this.showLoadDropdown = false
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
  li {
    padding-bottom: 0.5em;
  }

  /*
 *  STYLE 4
 *  from this codepen https://codepen.io/devstreak/pen/dMYgeO
 */

#scrollbar::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	background-color: #F5F5F5;
}

#scrollbar::-webkit-scrollbar
{
	width: 4px;
	background-color: #F5F5F5;
}

#scrollbar::-webkit-scrollbar-thumb
{
	background-color: #000000;
	border: 2px solid #555555;
}
</style>
