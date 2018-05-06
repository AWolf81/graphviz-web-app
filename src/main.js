// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLs from 'vue-ls'
import SocialSharing from 'vue-social-sharing'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
// Add this to your Apollo imports.
import { setContext } from 'apollo-link-context'

import store from './store'
import './ie-fix.js'

// load spinner css
require('../node_modules/spinkit/css/spinners/8-circle.css')
require('./assets/main.css') // load styling before Vue bootstrapped

Vue.config.productionTip = false

Vue.use(VueLs)
Vue.use(SocialSharing)

const httpLink = new HttpLink({
  // You should use an absolute URL here
  // uri: 'http://localhost:3020/graphql'
  // uri: 'https://kq5rqpnk37.lp.gql.zone/graphql'
  uri: 'https://graphql.cosmicjs.com/v1'

})

// Create a new Middleware Link using setContext
const middlewareLink = setContext(() => ({
  headers: {
    // 'Access-Control-Allow-Origin': '*',
    // 'Content-Type': 'application/json'
    // authorization: `Bearer ${HOWEVER_I_GET_MY_JWT}`
  }
}))

// Change your link assignment from
// const link = httpLink;
// to
const link = middlewareLink.concat(httpLink)

// Create the apollo client
const apolloClient = new ApolloClient({
  link, // : httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true
})

// Install the vue plugin
Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  provide: apolloProvider.provide(),
  components: { App }
})
