<template lang="html">
  <nav class="navbar navbar-default navbar-fixed-top">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" :class="{collapsed: !showCollapsedNav}" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" @click="showCollapsedNav = !showCollapsedNav" :aria-expanded="showCollapsedNav">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <router-link active-class="" to="/" class="navbar-brand">DrawViz</router-link>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
   <transition name="slide" enter-active-class="collapse collapsing" active-leave-class="collapse collapsing">
    <div class="navbar-collapse" :class="{'collapse in': showCollapsedNav}" id="bs-example-navbar-collapse-1" v-if="showCollapsedNav" :aria-expanded="showCollapsedNav">
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
  </transition>
  </div><!-- /.container-fluid -->
</nav>
</template>

<script>
import {mixin as clickaway} from 'vue-clickaway'
import {mapState} from 'vuex'
import { examples } from '../../App.constants'
import localGraphStorage from '@/components/LocalGraphStorage.vue'
import Headroom from 'headroom.js'

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
      headroom: undefined,
      examples,
      showExampleDropdown: false,
      showHelpDropdown: false,
      showCollapsedNav: false
    }
  },
  methods: {
    hideDropdown () {
      this.showExampleDropdown = false
    },
    removeGraph (graph) {
      this.$store.commit('removeGraph', graph)
    }
  },
  mounted () {
    // grab an element
    let navbar = document.querySelector('.navbar')
    // construct an instance of Headroom, passing the element
    this.headroom = new Headroom(navbar)
    // initialise
    this.headroom.init()
  }
}
</script>

<style lang="scss">
/**
 * Note: I have omitted any vendor-prefixes for clarity.
 * Adding them is left as an exercise for the reader.
 */
.headroom {
    will-change: transform;
    transition: transform 200ms linear;
}
.headroom--pinned {
    transform: translateY(0%);
}
.headroom--unpinned {
    transform: translateY(-100%);
}

</style>
