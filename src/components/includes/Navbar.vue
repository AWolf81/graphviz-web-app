<template lang="html">
  <nav class="navbar navbar-default navbar-fixed-top">
    <div class="container-fluid">
      <!-- Brand and toggle get grouped for better mobile display -->
      <div class="navbar-header">
        <button
          type="button"
          class="navbar-toggle collapsed"
          data-toggle="collapse"
          data-target="#bs-example-navbar-collapse-1"
          @click="showCollapsedNav = !showCollapsedNav"
          :aria-expanded="showCollapsedNav"
        >
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span> <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a
          href="#"
          class="navbar-brand"
          @click="
            updateGraphData({ data: dotData, name: '' });
            $router.push('/');
          "
          >DrawViz</a
        >
      </div>

      <!-- Collect the nav links, forms, and other content for toggling -->
      <!-- <transition name="slide" enter-active-class="collapse collapsing" active-leave-class="collapse collapsing"> -->
      <!-- fix collapsing -->
      <div
        class="navbar-collapse collapse"
        :class="{ in: showCollapsedNav }"
        id="bs-example-navbar-collapse-1"
        v-show="showCollapsedNav"
        :aria-expanded="showCollapsedNav"
      >
        <ul class="nav navbar-nav">
          <!-- <li class="active"><a href="#">Link <span class="sr-only">(current)</span></a></li>-->
          <!-- <li><a href="#">Link</a></li> -->
          <local-graph-storage :graphs="storedGraphs"></local-graph-storage>
          <dropdown>
            <span slot="trigger">Examples <span class="caret"></span></span>
            <ul class="dropdown-menu">
              <li
                v-for="(example, index) in examples"
                :key="'example-link' + index"
              >
                <router-link :to="'/example/' + index">
                  {{ example.caption }}
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
          </dropdown>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <!-- <li><a href="#">Link</a></li> -->
          <dropdown>
            <span slot="trigger">?</span>
            <ul class="dropdown-menu">
              <li><router-link :to="{ name: 'About' }">About</router-link></li>
              <!--<li><router-link to="/settings">Settings (tbd)</router-link></li>-->
              <!-- <li><a href="#">Another action</a></li>
            <li><a href="#">Something else here</a></li>
            <li role="separator" class="divider"></li>
            <li><a href="#">Separated link</a></li> -->
            </ul>
          </dropdown>
        </ul>
      </div>
      <!-- /.navbar-collapse -->
      <!-- </transition> -->
    </div>
    <!-- /.container-fluid -->
  </nav>
</template>

<script>
import { mixin as clickaway } from "vue-clickaway";
import { mapState, mapMutations } from "vuex";
import { examples } from "../../App.constants";
import localGraphStorage from "@/components/LocalGraphStorage.vue";
import dropdown from "@/components/Dropdown.vue";
import Headroom from "headroom.js";

export default {
  mixins: [clickaway],
  components: {
    localGraphStorage,
    dropdown
  },
  computed: {
    ...mapState(["storedGraphs", "dotData"])
  },
  data() {
    return {
      headroom: undefined,
      examples,
      showCollapsedNav: false
    };
  },
  methods: {
    ...mapMutations(["updateGraphData"]),
    hideDropdown() {
      this.showExampleDropdown = false;
    }
    // removeGraph (graph) {
    //   this.$store.commit('removeGraph', graph)
    // }
  },
  mounted() {
    // grab an element
    let navbar = document.querySelector(".navbar");
    // construct an instance of Headroom, passing the element
    this.headroom = new Headroom(navbar);
    // initialise
    this.headroom.init();
  }
};
</script>

<style lang="scss">
/* navbar */
.navbar-default {
  background-color: #f9f9f9;
  // #F8F8F8;
  border-color: #e8e8e8;
  border-bottom: 2px solid #e6e6e6;
}
//
// .navbar-default .navbar-nav > li > a {
//   color: #777;
// }
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
