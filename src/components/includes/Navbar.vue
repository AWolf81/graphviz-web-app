<template lang="html">
  <nav class="navbar navbar-default navbar-fixed-top">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <router-link active-class="" to="/" class="navbar-brand">GraphvizApp</router-link>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
        <!-- <li class="active"><a href="#">Link <span class="sr-only">(current)</span></a></li>-->
        <!-- <li><a href="#">Link</a></li> -->
        <local-graph-storage :graphs="storedGraphs" @remove="removeGraph"></local-graph-storage>
        <li class="dropdown" :class="{open: showExampleDropdown}">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" :aria-expanded="showExampleDropdown" @click="showExampleDropdown = !showExampleDropdown" >Examples <span class="caret"></span></a>
          <ul class="dropdown-menu" v-if="showExampleDropdown" v-on-clickaway="() => {showExampleDropdown = false}">
            <li v-for="(example, index) in examples" :key="'example-link' + index">
              <router-link :to="'/example/' + index">
                {{example.caption}}
              </router-link>
            </li>
            <!-- <li><a href="#">Action</a></li>
            <li><a href="#">Another action</a></li>
            <li><a href="#">Something else here</a></li>
            <li role="separator" class="divider"></li>
            <li><a href="#">Separated link</a></li>
            <li role="separator" class="divider"></li>
            <li><a href="#">One more separated link</a></li> -->
          </ul>
        </li>
      </ul>
      <ul class="nav navbar-nav navbar-right">
        <!-- <li><a href="#">Link</a></li> -->

        <!-- Todo create component for dropdowns -->
        <li class="dropdown" :class="{open: showHelpDropdown}">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" @click="showHelpDropdown = !showHelpDropdown">?</a>
          <ul class="dropdown-menu" v-if="showHelpDropdown" v-on-clickaway="() => {showHelpDropdown = false}">
            <li><router-link to="/about">About</router-link></li>
            <!--<li><router-link to="/settings">Settings (tbd)</router-link></li>-->
            <!-- <li><a href="#">Another action</a></li>
            <li><a href="#">Something else here</a></li>
            <li role="separator" class="divider"></li>
            <li><a href="#">Separated link</a></li> -->
          </ul>
        </li>
      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>
</template>

<script>
import {mixin as clickaway} from 'vue-clickaway'
import {mapState} from 'vuex'
import { examples } from '../../App.constants'
import localGraphStorage from '@/components/LocalGraphStorage.vue'

export default {
  mixins: [
    clickaway
  ],
  components: {
    localGraphStorage
  },
  computed: {
    ...mapState(['storedGraphs'])
  },
  data () {
    return {
      examples,
      showExampleDropdown: false,
      showHelpDropdown: false
    }
  },
  methods: {
    hideDropdown () {
      this.showExampleDropdown = false
    },
    removeGraph (graph) {
      this.$store.commit('removeGraph', graph)
    }
  }
}
</script>

<style lang="css">
</style>
