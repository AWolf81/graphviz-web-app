<template lang="html">
  <nav class="navbar navbar-default navbar-fixed-top">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" @click="showCollapsedNav = !showCollapsedNav" :aria-expanded="showCollapsedNav">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a href="#" class="navbar-brand" @click="updateGraphData({data: dotData, name: ''}); $router.push('/')">DrawViz</a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
   <!-- <transition name="slide" enter-active-class="collapse collapsing" active-leave-class="collapse collapsing"> -->
    <!-- fix collapsing -->
    <div class="navbar-collapse collapse" :class="{'in': showCollapsedNav}" id="bs-example-navbar-collapse-1" v-show="showCollapsedNav" :aria-expanded="showCollapsedNav">
      <ul class="nav navbar-nav">
        <!-- <li class="active"><a href="#">Link <span class="sr-only">(current)</span></a></li>-->
        <!-- <li><a href="#">Link</a></li> -->
        <local-graph-storage :graphs="storedGraphs" v-if="!isAuthenticated"></local-graph-storage>
        <dropdown>
            <span slot="trigger">Examples <span class="caret"></span></span>
            <ul class="dropdown-menu">
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
          </dropdown>
      </ul>
      <ul class="nav navbar-nav navbar-right">
        <dropdown v-if="isShareable">
          <span slot="trigger">Share</span>
          <social-sharing 
            :url="currentPage()" 
            inline-template 
            hashtags="GraphvizWebApp,javascript"
            network-tag="a"
            @copy="copyToClipboard"
            @change-visibility="changeVisibility({params: $route.params, newVisibility: 'public'})">
            <ul class="dropdown-menu">
              <li>
                <small>
                  <i class="fa fa-info-circle"></i> Share Info<br/>
                  By clicking any share button below your graph will be made publically available to anybody with the link (no login required). This permission can be revoked in your dashboard.
                </small>
              </li>
                <!-- <li>
                  <network network="facebook">
                    <i class="fa fa-fw fa-facebook"></i> Facebook
                  </network>
                </li> -->
                <li @click="() => $emit('copy')">
                  <a href="#">Copy url to clipboard</a>
                </li>
                <li>
                  <network network="linkedin" @open="() => $emit('changeVisibility')">
                    <i class="fa fa-fw fa-linkedin"></i> LinkedIn
                  </network>
                </li>
                <li>
                  <network network="twitter" @open="() => $emit('changeVisibility')">
                    <i class="fa fa-fw fa-twitter"></i> Twitter
                  </network>
                </li>
              </ul>
            </social-sharing>
        </dropdown>
        <dropdown>
          <span slot="trigger">?</span>
          <ul class="dropdown-menu">
            <li><router-link :to="{name: 'About'}">About</router-link></li>
            <li><router-link :to="{name: 'Privacy'}">Privacy</router-link></li>
            <li><router-link :to="{name: 'Terms'}">Terms of service</router-link></li>
            <!--<li><router-link to="/settings">Settings (tbd)</router-link></li>-->
            <!-- <li><a href="#">Another action</a></li>
            <li><a href="#">Something else here</a></li>
            <li role="separator" class="divider"></li>
            <li><a href="#">Separated link</a></li> -->
          </ul>
        </dropdown>
        <dropdown v-if="isAuthenticated">
            <span slot="trigger">
              <img :src="user.avatar" :title="user.username"/>
            </span>
            <ul class="dropdown-menu">
              <li class="dropdown-header">Welcome {{user.username}}</li>
              <li><router-link :to="{name: 'Dashboard'}">Dashboard</router-link></li>
              <li class="divider"></li>
              <li><a href="#" @click="logout">Logout</a></li>
            </ul>
        </dropdown>
        <li v-else><a href="#" @click="login">Login</a></li>
        <!-- <li><a href="#" @click="helloLambda">Test lambda</a></li> -->
      </ul>
    </div><!-- /.navbar-collapse -->
  <!-- </transition> -->
  </div><!-- /.container-fluid -->
</nav>
</template>

<script>
import {mixin as clickaway} from 'vue-clickaway'
import {mapState, mapMutations, mapGetters, mapActions} from 'vuex'
import { examples } from '../../App.constants'
import localGraphStorage from '@/components/LocalGraphStorage.vue'
import dropdown from '@/components/Dropdown.vue'
import Headroom from 'headroom.js'
import Netlify from 'netlify-auth-providers'
import axios from 'axios'
import {copyTextToClipboard} from '../../helpers/copyToClipboard'

export default {
  mixins: [
    clickaway
  ],
  components: {
    localGraphStorage,
    dropdown
  },
  computed: {
    ...mapState(['storedGraphs', 'dotData']),
    ...mapState({
      user: state => state.auth.user,
      visibility: state => state.dotMeta.visibility
    }),
    ...mapGetters(['isAuthenticated']),
    isShareable () {
      console.log('share check cloud', this.$route.params)
      return (this.$route.params.user && this.$route.params.slug)
    }
  },
  data () {
    console.log('data', this.copyToClipboard)
    return {
      headroom: undefined,
      examples,
      showCollapsedNav: false
    }
  },
  methods: {
    ...mapMutations(['updateGraphData', 'setVisibility']),
    ...mapActions(['changeVisibility']),
    copyToClipboard () {
      // console.log('copy')
      if (this.user) {
        this.changeVisibility({params: this.$route.params, newVisibility: 'public'})
      }
      copyTextToClipboard(window.location.href)
    },
    currentPage () {
      return window.location.href
    },
    hideDropdown () {
      this.showExampleDropdown = false
    },
    login () {
      // console.log(process.env) // ['site_id'])
      const authenticator = new Netlify(process.env.NETLIFY_SITE_ID ? {'site_id': process.env.NETLIFY_SITE_ID} : {})
      authenticator.authenticate({provider: 'github', scope: 'user'}, (err, data) => {
        if (err) {
          console.log(err)
          // return $("#output").text("Error Authenticating with GitHub: " + err);
        }
        console.log('Authenticated with GitHub. Access Token: ' + data.token, data)
        this.$store.dispatch('login', data.token)
        // $("#output").text("Authenticated with GitHub. Access Token: " + data.token);
      })
    },
    logout () {
      this.$store.dispatch('logout')
    },
    async helloLambda () {
      // fetch('/.netlify/functions/hello')
      // .then(response => response.json())
      // .then(json => console.log(json))
      const {data} = await axios.get('/.netlify/functions/hello')
      console.log('response', data.msg)
    }
    // removeGraph (graph) {
    //   this.$store.commit('removeGraph', graph)
    // }
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

<style lang="scss" scoped>
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

img {
  width: 30px;
  height: 30px;
  margin-top: -4px;
}

</style>
